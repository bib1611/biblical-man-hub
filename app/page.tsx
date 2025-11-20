'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AppId } from '@/types';
import { ArrowRight, BookOpen, MessageCircle, Shield, Mail, ExternalLink, Users, Zap, Target } from 'lucide-react';
import Dock from '@/components/dock/Dock';
import Window from '@/components/shared/Window';
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
import { products } from '@/lib/data/products';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { useABTest } from '@/hooks/useABTest';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import LandingPage from '@/components/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { windows, openWindow } = useAppStore();
  const [viewMode, setViewMode] = useState<'landing' | 'hub'>('landing');
  const [showHub, setShowHub] = useState(false);
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

  const enterHub = () => {
    setViewMode('hub');
    setShowHub(true);
  };

  // Landing page is the default view
  if (viewMode === 'landing') {
    console.log('Rendering Landing Page Mode');
    return <LandingPage onEnter={enterHub} />;
  }

  // Hub view after user clicks "Enter The Hub"
  return (
    <AuthProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-screen h-screen overflow-hidden bg-black"
      >
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative w-full h-full">
          <Dock />

          <div className="absolute left-0 md:left-20 top-0 right-0 bottom-0 md:bottom-0 bottom-20">
            {windows['content-feed'].isOpen && (
              <Window id="content-feed">
                <ContentFeed />
              </Window>
            )}

            {windows['bible-study'].isOpen && (
              <Window id="bible-study">
                <BibleStudy />
              </Window>
            )}

            {windows['sam'].isOpen && (
              <Window id="sam">
                <SamAssistant />
              </Window>
            )}

            {windows['products'].isOpen && (
              <Window id="products">
                <ProductsHub />
              </Window>
            )}

            {windows['radio'].isOpen && (
              <Window id="radio">
                <RadioPlayer />
              </Window>
            )}

            {windows['counseling'].isOpen && (
              <Window id="counseling">
                <SubstackArticles />
              </Window>
            )}

            {windows['about'].isOpen && (
              <Window id="about">
                <About />
              </Window>
            )}

            {windows['start-here'].isOpen && (
              <Window id="start-here">
                <StartHere />
              </Window>
            )}

            {windows['contact'].isOpen && (
              <Window id="contact">
                <ContactForm />
              </Window>
            )}

            {windows['community'].isOpen && (
              <Window id="community">
                <CommunityChat />
              </Window>
            )}

            {windows['admin'].isOpen && (
              <Window id="admin">
                <ProtectedAdminDashboard />
              </Window>
            )}
          </div>

          {Object.values(windows).every((w) => !w.isOpen) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-2xl px-8">
                <div className="mb-6 inline-block">
                  <div className="w-24 h-24 border-2 border-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">†</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  The Biblical Man Hub
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                  Your command center for Biblical transformation.
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Click an icon to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AuthProvider>
  );
}
