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
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { products } from '@/lib/data/products';

export default function Home() {
  const { windows, openWindow } = useAppStore();
  const [showHub, setShowHub] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
            Enter Hub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            Stop Being Soft.
            <br />
            <span className="text-red-500">Start Leading.</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Biblical masculinity for men who refuse to compromise
          </p>
          <button
            onClick={enterHub}
            className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 min-h-[48px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-base md:text-lg font-bold transition-all transform hover:scale-105 w-full sm:w-auto"
          >
            Access The Hub
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-20 px-6 bg-gradient-to-b from-red-950/20 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join 20,000+ Men and Women Who Refuse Mediocrity
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400">
              Get unfiltered Biblical truth delivered weekly. No fluff. No compromise.
            </p>
          </div>
          <form onSubmit={handleEmailSubmit} className="max-w-xl mx-auto">
            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-900/20 border border-green-600/50 rounded-lg text-green-200 text-center">
                <strong>Success!</strong> Check your email for your welcome message. (Check spam if you don't see it)
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-600/50 rounded-lg text-red-200 text-center">
                <strong>Error!</strong> Something went wrong. Please try again.
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/5 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold transition-all disabled:cursor-not-allowed w-full md:w-auto"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16">
            Everything You Need To Lead
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3">Bible Study</h3>
              <p className="text-gray-400 mb-4">
                Complete King James Bible with notes, highlights, and Alexander Scourby audio.
              </p>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('bible-study'), 100);
                }}
                className="text-red-500 hover:text-red-400 font-semibold inline-flex items-center gap-2"
              >
                Explore <ArrowRight size={16} />
              </button>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3">Chat with Sam</h3>
              <p className="text-gray-400 mb-4">
                Your personal guide to finding the right resources for transformation in marriage, leadership, and faith.
              </p>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('sam'), 100);
                }}
                className="text-red-500 hover:text-red-400 font-semibold inline-flex items-center gap-2"
              >
                Chat Now <ArrowRight size={16} />
              </button>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-3">Daily Biblical Truth</h3>
              <p className="text-gray-400 mb-4">
                Access our most impactful Substack articles on biblical manhood, marriage headship, and uncomfortable truths.
              </p>
              <button
                onClick={() => {
                  setShowHub(true);
                  setTimeout(() => openWindow('counseling'), 100);
                }}
                className="text-red-500 hover:text-red-400 font-semibold inline-flex items-center gap-2"
              >
                Read Articles <ArrowRight size={16} />
              </button>
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
    </div>
  );
}
