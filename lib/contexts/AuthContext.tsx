'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from './SessionContext';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isCreator } = useSession();

  useEffect(() => {
    // Auto-authenticate if user is creator from session system
    if (isCreator) {
      setIsAuthenticated(true);
      setLoading(false);
      console.log('👑 Creator auto-authenticated via session system');
    } else {
      // Check authentication status via old system
      checkAuthStatus();
    }
  }, [isCreator]);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Try to fetch analytics (protected endpoint) to verify auth status
      const response = await fetch('/api/admin/analytics');
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // SECURITY: Login now happens server-side with HTTP-only cookies
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false); // Logout locally even if API fails
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
