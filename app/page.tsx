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
        className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-black via-red-950/10 to-black"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/50">
                    <span className="text-5xl font-bold text-white">†</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-red-100 mb-4 tracking-tight">
                  The Biblical Man Hub
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                  Your command center for Biblical transformation.
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Click an icon at the bottom to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AuthProvider>
  );
  setShowHub(true);
  setTimeout(() => openWindow('products'), 100);
}}
className = "px-4 py-3 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 rounded-lg font-semibold text-sm transition-colors"
  >
  Details
                  </button >
                </div >
              </div >
            ))}
          </div >
  <div className="text-center mt-12">
    <button
      onClick={() => {
        setShowHub(true);
        setTimeout(() => openWindow('products'), 100);
      }}
      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-bold transition-all"
    >
      View All {products.length} Products
      <ArrowRight size={20} />
    </button>
  </div>
        </div >
      </section >

  {/* Why This Works Section - Address Objections */ }
  < section className = "py-16 md:py-20 px-6 bg-gradient-to-b from-red-950/10 to-black" >
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Why Men Choose This Over Everything Else
        </h2>
        <p className="text-lg text-gray-400">
          You've tried podcasts, books, and YouTube. Here's why this is different.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-600/30">
              <Shield className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">No Compromise on Scripture</h3>
              <p className="text-gray-400 text-sm">Everything is filtered through Biblical truth. No modern psychology masquerading as Christianity.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-950/40 to-black border border-blue-900/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-600/30">
              <Zap className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Application</h3>
              <p className="text-gray-400 text-sm">Not just theory. Every resource gives you specific actions to take today in your marriage and family.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-950/40 to-black border border-green-900/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-600/30">
              <Target className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Cuts Through the Noise</h3>
              <p className="text-gray-400 text-sm">Stop wasting time searching. Get curated, vetted resources from teachers who actually follow Scripture.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-950/40 to-black border border-purple-900/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-600/30">
              <Users className="text-purple-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Brotherhood Support</h3>
              <p className="text-gray-400 text-sm">You're not alone. Connect with men who are actually doing this, not just talking about it.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      </section >

  {/* CTA Section - Personalized by resistance level */ }
  < section className = "py-20 px-6" >
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-6xl font-bold mb-6">
        {psychographic?.resistanceLevel === 'low'
          ? "You're Ready. Let's Do This."
          : psychographic?.resistanceLevel === 'medium'
            ? 'Ready to Take the Next Step?'
            : 'Ready to Stop Making Excuses?'}
      </h2>
      <p className="text-xl text-gray-400 mb-8">
        {psychographic?.resistanceLevel === 'low'
          ? "You've seen enough. Time to access the full framework and start leading."
          : psychographic?.resistanceLevel === 'medium'
            ? 'Join thousands of men who made the decision to lead their families biblically.'
            : 'Every day you wait is another day your family suffers from weak leadership.'}
      </p>
      <button
        onClick={enterHub}
        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-xl font-bold transition-all transform hover:scale-105"
      >
        {config?.primaryCTA || 'Enter The Hub'}
        <ArrowRight size={24} />
      </button>
      <p className="text-sm text-gray-500 mt-6">Free to access. No credit card required.</p>
    </div>
      </section >

  {/* Footer */ }
  < footer className = "py-12 px-6 border-t border-red-900/20" >
    <div className="max-w-7xl mx-auto text-center text-gray-500">
      <p className="mb-2">© 2025 The Biblical Man. All rights reserved.</p>
      <p className="text-sm">Built for men who lead.</p>
    </div>
      </footer >

  {/* REAL-TIME PROFILING BADGE - Shows user we're tracking them */ }
{
  psychographic && (
    <div className="fixed top-20 right-4 bg-gradient-to-br from-purple-900/95 to-black/95 border-2 border-purple-500 rounded-xl p-4 max-w-xs shadow-2xl shadow-purple-900/50 z-50 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <div className="font-bold text-purple-300 text-sm">🧠 Profile Detected</div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="bg-black/40 rounded-lg p-2 border border-purple-800/50">
          <div className="text-gray-400 text-[10px]">PERSONALITY TYPE</div>
          <div className="text-purple-200 font-bold uppercase">{psychographic.personalityType}</div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-purple-800/50">
          <div className="text-gray-400 text-[10px]">CONVERSION READINESS</div>
          <div className="text-purple-200 font-bold">{psychographic.conversionReadiness}/100</div>
        </div>
        <div className="text-[10px] text-gray-500 mt-2">
          Personalized messaging active
        </div>
      </div>
    </div>
  )
}

{/* DEBUG PANEL - Dev only */ }
{
  process.env.NODE_ENV === 'development' && psychographic && (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-green-500 rounded-lg p-4 max-w-md text-xs text-green-400 font-mono z-50">
      <div className="font-bold text-green-300 mb-2">🧠 Psychographic Debug</div>
      <div className="space-y-1">
        <div><strong>Personality:</strong> {psychographic.personalityType}</div>
        <div><strong>Conversion Readiness:</strong> {psychographic.conversionReadiness}/100</div>
        <div><strong>Message Framing:</strong> {psychographic.messageFraming}</div>
        <div><strong>Copy Tone:</strong> {psychographic.copyTone}</div>
        <div><strong>Urgency Level:</strong> {psychographic.urgencyLevel}</div>
        <div className="pt-2 mt-2 border-t border-green-800">
          <strong>Current Headline:</strong><br />
          <span className="text-white text-[10px]">{messaging?.headline}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-green-800">
          <strong>CTA:</strong> {messaging?.cta}
        </div>
      </div>
    </div>
  )
}
    </div >
  );
}
