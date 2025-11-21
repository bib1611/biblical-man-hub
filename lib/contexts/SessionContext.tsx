'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateFingerprint, storeFingerprintLocally, getStoredFingerprint, type DeviceInfo } from '@/lib/fingerprint';

export interface UserData {
  id: string;
  email?: string;
  role: 'creator' | 'admin' | 'user';
  displayName?: string;
  isCreator: boolean;
  preferences: Record<string, any>;
  uiState: Record<string, any>;
  viewedArticles: string[];
  favoriteProducts: string[];
  bookmarkedVerses: string[];
  radioPreferences: Record<string, any>;
}

interface SessionContextType {
  user: UserData | null;
  loading: boolean;
  isCreator: boolean;
  fingerprint: string | null;
  deviceInfo: DeviceInfo | null;

  // Memory functions
  updatePreferences: (prefs: Record<string, any>) => Promise<void>;
  updateUIState: (state: Record<string, any>) => Promise<void>;
  trackActivity: (activityType: string, data?: any) => Promise<void>;
  markArticleViewed: (slug: string) => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
  login: (email: string) => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  // Activity tracking - save UI state every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Auto-save current app state
      const currentApp = window.location.pathname.split('/')[1] || 'home';
      updateUIState({ lastApp: currentApp, lastSeen: new Date().toISOString() });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const initializeSession = async () => {
    setLoading(true);

    try {
      // Check if fingerprint exists locally
      let fp = getStoredFingerprint();

      // Generate fingerprint if not cached
      if (!fp) {
        console.log('📌 Generating device fingerprint...');
        const fingerprintData = await generateFingerprint();
        fp = fingerprintData.hash;
        storeFingerprintLocally(fingerprintData);
        setDeviceInfo(fingerprintData.deviceInfo);
      }

      setFingerprint(fp);

      // Initialize session with backend
      const response = await fetch('/api/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fingerprint: fp,
          deviceInfo
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);

          // Log recognition status
          if (data.recognized) {
            console.log('✅ User session restored automatically');
          } else {
            console.log('🆕 New session created');
          }

          if (data.user.isCreator) {
            console.log('👑 Creator recognized! Welcome back.');
          }
        }
      } else {
        console.error('Failed to initialize session:', response.statusText);
      }
    } catch (error) {
      console.error('Session initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    await initializeSession();
  };

  const updatePreferences = async (prefs: Record<string, any>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'preferences',
          data: { ...user.preferences, ...prefs }
        })
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...prefs } } : null);
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const updateUIState = async (state: Record<string, any>) => {
    if (!user) return;

    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'ui_state',
          data: { ...user.uiState, ...state }
        })
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, uiState: { ...prev.uiState, ...state } } : null);
      }
    } catch (error) {
      console.error('Failed to update UI state:', error);
    }
  };

  const trackActivity = async (activityType: string, activityData?: any) => {
    if (!user) return;

    try {
      await fetch('/api/session/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          activityType,
          activityData,
          appName: window.location.pathname.split('/')[1],
          urlPath: window.location.pathname
        })
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  const markArticleViewed = async (slug: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'viewed_article',
          data: { slug }
        })
      });

      if (response.ok) {
        setUser(prev => {
          if (!prev) return null;
          const viewed = [slug, ...(prev.viewedArticles || [])].slice(0, 50);
          return { ...prev, viewedArticles: viewed };
        });
      }
    } catch (error) {
      console.error('Failed to mark article viewed:', error);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        isCreator: user?.isCreator || false,
        fingerprint,
        deviceInfo,
        updatePreferences,
        updateUIState,
        trackActivity,
        markArticleViewed,
        refreshSession,
        login
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
