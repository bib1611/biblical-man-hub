'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AppId } from '@/types';
import { ArrowRight, BookOpen, MessageCircle, Shield, Mail, ExternalLink, Users, Zap, Target } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentFeed from '@/components/windows/ContentFeed';
import BibleStudy from '@/components/windows/BibleStudy';
import SamAssistant from '@/components/windows/SamAssistant';
import ProductsHub from '@/components/windows/ProductsHub';
import RadioPlayer from '@/components/windows/RadioPlayer';
import SubstackArticles from '@/components/windows/SubstackArticles';
import ContactForm from '@/components/windows/ContactForm';
import ProtectedAdminDashboard from '@/components/windows/ProtectedAdminDashboard';
import About from '@/components/windows/About';
import StartHere from '@/components/windows/StartHere';
import CommunityChat from '@/components/windows/CommunityChat';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { SessionProvider } from '@/lib/contexts/SessionContext';
import { products } from '@/lib/data/products';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { useABTest } from '@/hooks/useABTest';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import LandingPage from '@/components/LandingPage';
import HubHero from '@/components/HubHero';
import { AnimatePresence, motion } from 'framer-motion';
import { SilentErrorBoundary } from '@/components/ErrorBoundary';
import GlobalAudioProvider from '@/components/GlobalAudioProvider';

export default function Home() {
  const { windows, openWindow } = useAppStore();
  const [viewMode, setViewMode] = useState<'landing' | 'hub'>('landing');
  const [showHub, setShowHub] = useState(false);
  const [activeApp, setActiveApp] = useState<string>('bible');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize analytics tracking
  const { trackWindowOpen, trackEmailCapture } = useAnalytics();

  // Initialize personalization with psychographic data
  const { config, profile, messaging, timing, psychographic } = usePersonalization();

  // 🧪 A/B TEST: Headline Variations
  const headlineVariant = useABTest({
    testName: 'homepage_headline_v1',
    variants: ['A', 'B'],
    weights: [0.5, 0.5],
  });

  // 📜 SCROLL DEPTH: Trigger urgency at 50% scroll
  const { hasReached } = useScrollDepth();
  const showUrgencyBanner = hasReached(50);

  // Get featured products for homepage
  const featuredProducts = products.filter(p => p.isFeatured);

  useEffect(() => {
    const handleOpenWindow = (e: CustomEvent) => {
      const windowId = e.detail as AppId;
      if (useAppStore.getState().windows[windowId]) {
        useAppStore.getState().openWindow(windowId);
      }
    };

    window.addEventListener('open-window' as any, handleOpenWindow as EventListener);

    return () => {
      window.removeEventListener('open-window' as any, handleOpenWindow as EventListener);
    };
  }, []);

  // Check URL params for auto-opening app (from member hub)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appParam = urlParams.get('app');

    if (appParam) {
      // Auto-enter hub and open the requested app
      enterHub(appParam);
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus('success');

        // Track email capture in analytics
        trackEmailCapture(email);

        setEmail('');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const enterHub = (appId?: string) => {
    if (appId) {
      setActiveApp(appId);
    }
    setViewMode('hub');
    setShowHub(true);
  };

  // Wrap everything in SessionProvider so session is initialized immediately
  return (
    <SessionProvider>
      <AuthProvider>
        {viewMode === 'landing' ? (
          <LandingPage onEnter={enterHub} />
        ) : (
          <>
            <GlobalAudioProvider />
            <DashboardLayout activeApp={activeApp} onAppChange={setActiveApp}>
              {activeApp === 'bible' && <BibleStudy />}
              {activeApp === 'radio' && <RadioPlayer />}
              {activeApp === 'sam' && <SamAssistant />}
              {activeApp === 'admin' && <ProtectedAdminDashboard />}
              {activeApp === 'products' && <ProductsHub />}
              {activeApp === 'content-feed' && <ContentFeed />}
              {activeApp === 'counseling' && <SubstackArticles />}
              {activeApp === 'community' && <CommunityChat />}
              {activeApp === 'about' && <About />}
              {activeApp === 'start-here' && <StartHere />}
              {activeApp === 'contact' && <ContactForm />}
            </DashboardLayout>
          </>
        )}
      </AuthProvider>
    </SessionProvider>
  );
}
