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

  if (viewMode === 'landing') {
    console.log('Rendering Landing Page Mode');
    return <LandingPage onEnter={enterHub} />;
  }

  if (showHub) {
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
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900 selection:text-white">
      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        onChat={() => {
          setShowHub(true);
          setTimeout(() => openWindow('sam'), 100);
          trackWindowOpen('sam');
        }}
        onShop={() => {
          setShowHub(true);
          setTimeout(() => openWindow('products'), 100);
          trackWindowOpen('products');
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center">
              <span className="text-lg md:text-xl font-bold text-white">†</span>
            </div>
            <span className="text-base md:text-xl font-bold">THE BIBLICAL MAN</span>
          </div>
          <button
            onClick={enterHub}
            className="px-4 md:px-6 py-2 md:py-2 min-h-[44px] bg-red-600 hover:bg-red-700 rounded-lg text-sm md:text-base font-semibold transition-colors"
          >
            {config?.primaryCTA || 'Enter Hub'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Time-based message banner (if applicable) */}
            {timing?.timeBasedMessage && (
              <div className="inline-block mb-4 px-6 py-3 bg-blue-600/20 border border-blue-600/50 rounded-full">
                <p className="text-sm md:text-base text-blue-300 font-semibold">
                  {timing.timeBasedMessage}
                </p>
              </div>
            )}

            {/* Psychographic headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-heading animate-scale-in">
              {headlineVariant === 'B'
                ? (messaging?.headline || 'Lead Your Family.')
                : (messaging?.headline || config?.heroMessage || 'Stop Being Soft.')}
              <br />
              <span className="text-red-500">
                {profile?.isReturning
                  ? 'Ready to Take the Next Step?'
                  : (headlineVariant === 'B' ? 'Build Your Legacy.' : 'Start Leading.')}
              </span>
            </h1>

            {/* Psychographic subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {messaging?.subheadline ||
                (profile?.isReturning
                  ? `Welcome back! Let's pick up where you left off.`
                  : 'Biblical masculinity for men who refuse to compromise')
              }
            </p>

            {/* Urgency message (if applicable) */}
            {timing?.shouldShowUrgency && messaging?.urgency && (
              <div className="inline-block mb-4 px-6 py-3 bg-amber-600/20 border border-amber-600/50 rounded-full">
                <p className="text-sm md:text-base text-amber-300 font-bold">
                  ⚡ {messaging.urgency}
                </p>
              </div>
            )}

            {/* PROMINENT SHOP PRODUCTS CTA - Above the Fold */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('products'), 100);
                  trackWindowOpen('products');
                }}
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
              >
                <span>Shop Biblical Manhood Resources</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={enterHub}
                className="px-8 py-4 bg-gray-800/60 hover:bg-gray-800/80 border-2 border-gray-700 hover:border-gray-600 rounded-xl font-bold text-lg transition-all"
              >
                Access Free Hub
              </button>
            </div>
          </div>

          {/* PRIMARY CTA: Newsletter Signup */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-gradient-to-br from-red-950/60 to-black border-2 border-red-600/50 rounded-2xl p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full text-sm font-bold text-red-300">
                    <Mail className="inline w-4 h-4 mr-2" />
                    FREE WEEKLY NEWSLETTER
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Join 20,000+ Men Who Refuse Mediocrity
                </h3>
                <p className="text-base md:text-lg text-gray-300">
                  Get unfiltered Biblical truth delivered weekly. No fluff. No compromise.
                </p>

                {/* Social proof */}
                {messaging?.socialProof && (
                  <p className="text-sm text-gray-400 mt-3">
                    {messaging.socialProof}
                  </p>
                )}
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {submitStatus === 'success' && (
                  <div className="p-5 bg-green-600/90 border-2 border-green-400 rounded-xl text-white text-center font-semibold shadow-lg shadow-green-600/50 animate-pulse">
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">🎉</span>
                      <strong>Success! You're In!</strong>
                    </div>
                    <p className="text-sm mt-2 text-green-100">Check your email (and spam folder) for instant access.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-5 bg-red-600/90 border-2 border-red-400 rounded-xl text-white text-center font-semibold shadow-lg shadow-red-600/50">
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">⚠️</span>
                      <strong>Submission Failed</strong>
                    </div>
                    <p className="text-sm mt-2 text-red-100">Please check your email address and try again.</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 bg-black/40 border-2 border-red-900/40 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold transition-all disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : (messaging?.cta || 'Get Free Access')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500">
                  No spam. Unsubscribe anytime. We respect your inbox.
                </p>
              </form>
            </div>
          </div>

          {/* Secondary Quick Links */}
          <div className="text-center">
            <p className="text-gray-400 mb-4 text-sm">Or explore free resources:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('bible-study'), 100);
                  trackWindowOpen('bible-study');
                }}
                className="text-gray-300 hover:text-red-500 underline transition-colors"
              >
                📖 Read KJV Bible
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('radio'), 100);
                  trackWindowOpen('radio');
                }}
                className="text-gray-300 hover:text-red-500 underline transition-colors"
              >
                📻 Listen to Radio
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={enterHub}
                className="text-gray-300 hover:text-red-500 underline transition-colors"
              >
                🎯 Access Full Hub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PRODUCTS PREVIEW - Early Product Exposure */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-red-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading">
              Proven Resources for Biblical Manhood
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              Frameworks that work. No theory. No fluff.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('products'), 100);
                  trackWindowOpen('products');
                }}
                className="p-5 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl cursor-pointer hover:border-red-600/50 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${product.price === 0
                    ? 'bg-green-600/20 border border-green-600/50 text-green-300'
                    : 'bg-purple-600/20 border border-purple-600/50 text-purple-300'
                    }`}>
                    {product.price === 0 ? 'FREE' : `$${product.price}`}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => {
                setShowHub(true);
                setTimeout(() => openWindow('products'), 100);
                trackWindowOpen('products');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
            >
              View All {products.length} Resources
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Build Trust */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-red-950/20 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
              Trusted by 20,000+ Men Leading Their Families
            </h2>
            <p className="text-lg text-gray-400">
              Real results from men who stopped making excuses and started leading.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-500">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  "This framework saved my marriage. I was passive and weak. Now I lead with confidence and Biblical authority. My wife respects me again."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                  <span className="text-lg font-bold text-red-500">M</span>
                </div>
                <div>
                  <div className="font-bold text-white">Michael R.</div>
                  <div className="text-xs text-gray-500">Husband, Father of 3</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-500">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  "No fluff. No compromise. Pure Biblical truth that actually works. This is what Christian men desperately need."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                  <span className="text-lg font-bold text-red-500">J</span>
                </div>
                <div>
                  <div className="font-bold text-white">James P.</div>
                  <div className="text-xs text-gray-500">Pastor, 15 Years</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-500">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  "Finally found content that doesn't sugarcoat Scripture. This is real, actionable Biblical masculinity. Game changer."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                  <span className="text-lg font-bold text-red-500">D</span>
                </div>
                <div>
                  <div className="font-bold text-white">David K.</div>
                  <div className="text-xs text-gray-500">Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section - Hook Users to Keep Scrolling */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-black to-red-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
              Everything You Need to Lead Your Family
              <br />
              <span className="text-red-500">In One Place</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Stop piecing together advice from random YouTube videos and blog posts. Get a complete system for Biblical masculinity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-600/50">
                <MessageCircle className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Biblical Counselor</h3>
              <p className="text-gray-400">Get instant Scripture-backed guidance for marriage, parenting, and leadership challenges</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-600/50">
                <BookOpen className="text-blue-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Complete Resource Library</h3>
              <p className="text-gray-400">Curated books, courses, and articles from trusted Biblical teachers - no compromise</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-600/50">
                <Users className="text-green-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Brotherhood Community</h3>
              <p className="text-gray-400">Connect with 20,000+ men who refuse to compromise on Biblical truth</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent mb-6" />
          <p className="text-center text-sm text-gray-500 font-semibold">EXPLORE YOUR AI GUIDE BELOW ↓</p>
        </div>
      </section>

      {/* Sam AI Chat Feature */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-full text-sm font-bold text-blue-300">
                  <MessageCircle className="inline w-4 h-4 mr-2" />
                  AI-POWERED GUIDANCE
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">
                {psychographic?.painPoints?.[0]
                  ? `Get Help With ${psychographic.painPoints[0]}`
                  : 'Get Instant Biblical Guidance'}
                <br />
                <span className="text-red-500">From Sam, Your AI Guide</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {(profile?.leadScore ?? 0) > 70
                  ? "You're serious about this. Sam has advanced frameworks for high-level leadership challenges. Ask the hard questions."
                  : psychographic?.personalityType === 'analytical'
                    ? 'Sam provides Scripture-backed answers with full context and references. Get precise guidance for your specific situation.'
                    : 'Struggling with marriage? Need leadership advice? Want to find the right resource? Sam is trained on Biblical truth and can help you navigate your specific situation with wisdom from Scripture and trusted teachers.'}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">24/7 Biblical Counsel</h4>
                    <p className="text-gray-400 text-sm">Get answers anytime, backed by Scripture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Resource Recommendations</h4>
                    <p className="text-gray-400 text-sm">Find the exact book, course, or article you need</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Marriage & Leadership Help</h4>
                    <p className="text-gray-400 text-sm">Specific strategies for leading your family</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('sam'), 100);
                  trackWindowOpen('sam');
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                Chat with Sam Now
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-2xl p-8 md:p-10">
              <div className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">User:</p>
                  <p className="text-white">"How do I lead my wife biblically when she resists?"</p>
                </div>
                <div className="bg-red-950/30 rounded-xl p-4 border border-red-900/30">
                  <p className="text-sm text-red-400 mb-2">Sam:</p>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Ephesians 5:25-28 calls husbands to love their wives as Christ loved the church. This means sacrificial leadership, not domination. Check out "The Excellent Wife" by Martha Peace and my analysis of biblical headship in the Resources Hub...
                  </p>
                </div>
                <p className="text-center text-xs text-gray-500 mt-6">
                  Real Biblical wisdom, instant responses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20 px-6 bg-gradient-to-b from-black to-red-950/20">
        <div className="max-w-7xl mx-auto">
          {/* Trust Signals - Social Proof */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/10 border border-green-600/30 rounded-full mb-4">
              <span className="text-green-400 text-2xl">✓</span>
              <span className="text-green-300 font-bold">Trusted by 20,000+ Men</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-2">
              <span>⭐⭐⭐⭐⭐ 4.9/5 Average Rating</span>
              <span>•</span>
              <span>100% Money-Back Guarantee</span>
              <span>•</span>
              <span>Instant Access</span>
            </div>
          </div>

          <div className="text-center mb-8 md:mb-12">
            {/* Urgency Banner - Triggered by Scroll Depth */}
            <div className={`inline-block mb-6 px-6 py-3 bg-amber-600/20 border-2 border-amber-600/50 rounded-lg transition-all duration-500 ${showUrgencyBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-amber-300 font-bold flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Limited Time: Get FREE bonuses with any purchase this week
              </p>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading">
              {psychographic?.personalityType === 'analytical'
                ? 'Data-Driven Frameworks That Work'
                : psychographic?.personalityType === 'skeptic'
                  ? 'Proven Systems (Not Theory)'
                  : 'Frameworks That Actually Work'}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400">
              {psychographic?.buyingStyle === 'researcher'
                ? 'Evidence-based systems with real results. Full breakdowns included.'
                : psychographic?.buyingStyle === 'impulsive'
                  ? 'Get instant access. Start transforming today.'
                  : 'No theory. No fluff. Just tested systems for Biblical masculinity.'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('products'), 100);
                  trackWindowOpen('products');
                }}
                className="p-6 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl cursor-pointer hover:border-red-600/50 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  {product.price === 0 ? (
                    <span className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-full text-sm font-bold text-green-300">
                      PAY WHAT YOU WANT
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-full text-sm font-bold text-purple-300">
                      ${product.price}
                    </span>
                  )}
                  {product.features.some(f => f.includes('5/5')) && (
                    <span className="px-3 py-1 bg-amber-600/20 border border-amber-600/50 rounded-full text-xs font-bold text-amber-300">
                      ⭐ TOP RATED
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  <a
                    href={product.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors text-center inline-flex items-center justify-center gap-2"
                  >
                    {product.price === 0 ? 'Get Resource' : `Get for $${product.price}`}
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => {
                      setShowHub(true);
                      setTimeout(() => openWindow('products'), 100);
                    }}
                    className="px-4 py-3 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
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
        </div>
      </section>

      {/* Why This Works Section - Address Objections */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-red-950/10 to-black">
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
      </section>

      {/* CTA Section - Personalized by resistance level */}
      <section className="py-20 px-6">
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
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-red-900/20">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2025 The Biblical Man. All rights reserved.</p>
          <p className="text-sm">Built for men who lead.</p>
        </div>
      </footer>

      {/* REAL-TIME PROFILING BADGE - Shows user we're tracking them */}
      {psychographic && (
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
      )}

      {/* DEBUG PANEL - Dev only */}
      {process.env.NODE_ENV === 'development' && psychographic && (
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
      )}
    </div>
  );
}
