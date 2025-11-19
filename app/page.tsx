'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AppId } from '@/types';
import { ArrowRight, BookOpen, MessageCircle, Shield, Mail, ExternalLink } from 'lucide-react';
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
import ExitIntentPopup from '@/components/ExitIntentPopup';

export default function Home() {
  const { windows, openWindow } = useAppStore();
  const [showHub, setShowHub] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize analytics tracking
  const { trackWindowOpen, trackEmailCapture } = useAnalytics();

  // Initialize personalization with psychographic data
  const { config, profile, messaging, timing, psychographic } = usePersonalization();

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
    setShowHub(true);
  };

  if (showHub) {
    return (
      <AuthProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-black via-red-950/10 to-black">
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
      </div>
      </AuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {messaging?.headline || config?.heroMessage || 'Stop Being Soft.'}
              <br />
              <span className="text-red-500">
                {profile?.isReturning ? 'Ready to Take the Next Step?' : 'Start Leading.'}
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
          </div>

          {/* Interactive Hook: Bible + Radio */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Bible Study Hook */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border-2 border-red-900/50 rounded-2xl p-8 hover:border-red-600/70 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-600/30">
                  <BookOpen className="w-7 h-7 text-red-500" />
                </div>
                <span className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-xs font-bold text-green-300">
                  FREE
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Read the King James Bible</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Complete KJV Bible with Alexander Scourby audio narration, highlights, and notes. Study the Word the way God intended.
              </p>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('bible-study'), 100);
                  trackWindowOpen('bible-study');
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold transition-all transform group-hover:scale-105 flex items-center justify-center gap-2"
              >
                Open Bible Study
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Radio Hook */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border-2 border-red-900/50 rounded-2xl p-8 hover:border-red-600/70 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-600/30">
                  <MessageCircle className="w-7 h-7 text-red-500" />
                </div>
                <span className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-xs font-bold text-green-300">
                  FREE
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">24/7 Christian Radio</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Solid Bible teaching, preaching, singing, and storytelling. Your audio companion for truth anytime, anywhere.
              </p>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('radio'), 100);
                  trackWindowOpen('radio');
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold transition-all transform group-hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Listening
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <button
              onClick={enterHub}
              className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-black border-2 border-red-600 hover:bg-red-600/10 rounded-xl text-lg font-bold transition-all transform hover:scale-105"
            >
              Access Full Hub (Bible, Radio, Chat & More)
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Primary Conversion */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-red-950/30 to-black border-y border-red-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-red-950/60 to-black border-2 border-red-600/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full text-sm font-bold text-red-300">
                  <Mail className="inline w-4 h-4 mr-2" />
                  FREE WEEKLY NEWSLETTER
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                Join 20,000+ Men and Women
                <br />
                <span className="text-red-500">Who Refuse Mediocrity</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-4">
                Get unfiltered Biblical truth delivered weekly. No fluff. No compromise. Real frameworks for leading your family and walking in truth.
              </p>

              {/* Social proof badge */}
              {messaging?.socialProof && (
                <p className="text-sm md:text-base text-gray-400 mt-4">
                  {messaging.socialProof}
                </p>
              )}

              {/* Guarantee */}
              {messaging?.guarantee && psychographic?.resistanceLevel === 'high' && (
                <p className="text-sm text-green-400 mt-2 font-semibold">
                  ✓ {messaging.guarantee}
                </p>
              )}
            </div>
            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto">
              {submitStatus === 'success' && (
                <div className="mb-6 p-5 bg-green-900/30 border-2 border-green-600/60 rounded-xl text-green-200 text-center">
                  <strong className="text-lg">🎉 Success!</strong>
                  <p className="mt-2">Check your email for your welcome message. (Check spam if you don't see it)</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-5 bg-red-900/30 border-2 border-red-600/60 rounded-xl text-red-200 text-center">
                  <strong className="text-lg">Error!</strong>
                  <p className="mt-2">Something went wrong. Please try again.</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-5 bg-black/40 border-2 border-red-900/40 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-lg font-bold transition-all disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSubmitting ? 'Subscribing...' : (messaging?.cta || 'Get Free Access')}
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </form>
          </div>
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
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Get Instant Biblical Guidance
                <br />
                <span className="text-red-500">From Sam, Your AI Guide</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Struggling with marriage? Need leadership advice? Want to find the right resource? Sam is trained on Biblical truth and can help you navigate your specific situation with wisdom from Scripture and trusted teachers.
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
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frameworks That Actually Work
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400">
              No theory. No fluff. Just tested systems for Biblical masculinity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="p-6 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl hover:border-red-600/50 transition-all group"
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

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Stop Making Excuses?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Every day you wait is another day your family suffers from weak leadership.
          </p>
          <button
            onClick={enterHub}
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-xl font-bold transition-all transform hover:scale-105"
          >
            Enter The Hub
            <ArrowRight size={24} />
          </button>
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
