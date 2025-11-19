'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, MessageCircle, Shield, Mail, ExternalLink, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * DEDICATED SUBSTACK LANDING PAGE
 *
 * Optimized for 629+ Substack referrals (top traffic source)
 * Personalized messaging for newsletter subscribers
 * Direct path to products and resources
 */

export default function SubstackLanding() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-white">
      {/* Hero Section - Personalized for Newsletter Readers */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-600/50 rounded-full mb-8 animate-pulse">
            <Mail className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-bold">Welcome, Newsletter Reader!</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
            Your Complete Biblical Manhood Hub
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            You've been reading the newsletter. Now access the <span className="text-red-400 font-bold">entire framework</span> — tools, resources, and products that transform theory into action.
          </p>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Everything you need to lead with biblical authority. All in one place.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/?from=substack&action=products"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
            >
              <span>View Premium Resources</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/?from=substack"
              className="px-8 py-4 bg-gray-800/60 hover:bg-gray-800/80 border-2 border-gray-700 hover:border-gray-600 rounded-xl font-bold text-lg transition-all"
            >
              Explore Free Hub
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              20,000+ Men
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              4.9/5 Rating
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Money-Back Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-red-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What's Inside The Hub?
            </h2>
            <p className="text-lg text-gray-400">
              More than just a newsletter — it's your complete command center
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Sam AI Counselor */}
            <div className="p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl hover:border-red-600/50 transition-all">
              <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Sam: AI Biblical Guide</h3>
              <p className="text-gray-400 mb-4">
                Get instant Biblical guidance on marriage, parenting, finances, and spiritual warfare. Trained on Scripture and proven frameworks.
              </p>
              <Link
                href="/?from=substack&action=sam"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-2 group"
              >
                Try Sam Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 2: KJV Bible Study */}
            <div className="p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl hover:border-red-600/50 transition-all">
              <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">KJV Bible + Audio</h3>
              <p className="text-gray-400 mb-4">
                Full KJV Bible with Alexander Scourby narration. Study anywhere, anytime. Zero distractions.
              </p>
              <Link
                href="/?from=substack&action=bible"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-2 group"
              >
                Open Bible
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 3: Premium Products */}
            <div className="p-8 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl hover:border-red-600/50 transition-all">
              <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Premium Frameworks</h3>
              <p className="text-gray-400 mb-4">
                Deep-dive courses, guides, and resources. Everything from the newsletter, but 10x deeper and more actionable.
              </p>
              <Link
                href="/?from=substack&action=products"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-2 group"
              >
                Browse Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Most Popular With Newsletter Readers
            </h2>
            <p className="text-lg text-gray-400">
              The frameworks that turn subscribers into doers
            </p>
          </div>

          {/* Limited Time Offer Banner */}
          <div className="max-w-3xl mx-auto mb-10 p-6 bg-gradient-to-r from-amber-600/20 to-red-600/20 border-2 border-amber-600/50 rounded-xl animate-pulse">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">Newsletter Reader Exclusive</h3>
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-center text-amber-200 font-semibold">
              Get 20% off your first purchase + FREE bonuses
            </p>
            <p className="text-center text-amber-300/70 text-sm mt-1">
              Use code: <span className="font-mono bg-black/30 px-2 py-1 rounded">SUBSTACK20</span>
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Biblical Masculinity Framework',
                price: '$47',
                description: 'Complete system for leading with authority',
                rating: '4.9',
                students: '2,847',
              },
              {
                title: 'Marriage Dominance Blueprint',
                price: '$67',
                description: 'Become the spiritual head your wife needs',
                rating: '5.0',
                students: '1,923',
              },
              {
                title: 'Financial Sovereignty Course',
                price: '$97',
                description: 'Biblical wealth-building strategies',
                rating: '4.8',
                students: '1,456',
              },
            ].map((product, idx) => (
              <Link
                key={idx}
                href="/?from=substack&action=products"
                className="group p-6 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl hover:border-red-600/50 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-red-400">{product.price}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold">{product.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{product.students} students</span>
                  <span className="flex items-center gap-1 text-red-400 font-semibold group-hover:gap-2 transition-all">
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/?from=substack&action=products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg transition-all"
            >
              View All Products
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup (for non-subscribers who arrive here) */}
      {!submitSuccess && (
        <section className="py-16 px-6 bg-gradient-to-b from-red-950/10 to-transparent">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Subscribed Yet?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join 20,000+ men getting weekly Biblical frameworks for leadership, marriage, and spiritual warfare.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-6 py-4 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold transition-all whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Get Free Access'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              No spam. Unsubscribe anytime. Your email is safe with us.
            </p>
          </div>
        </section>
      )}

      {submitSuccess && (
        <section className="py-16 px-6 bg-gradient-to-b from-green-950/20 to-transparent">
          <div className="max-w-2xl mx-auto text-center p-8 bg-green-600/10 border border-green-600/30 rounded-xl">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-300 mb-2">
              You're In! Check Your Email.
            </h2>
            <p className="text-gray-400">
              Your first email is on the way with immediate access to the framework.
            </p>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Other Newsletter Readers Are Saying
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'David M.',
                role: 'Subscriber since 2023',
                text: 'The newsletter opened my eyes. The products gave me the complete roadmap. My marriage is transformed.',
              },
              {
                name: 'Michael R.',
                role: 'Subscriber since 2024',
                text: 'I was tired of weak Christian teaching. This is the real deal. No compromise. Just Biblical truth.',
              },
              {
                name: 'James T.',
                role: 'Subscriber since 2023',
                text: "The Sam AI counselor is incredible. It's like having a Biblical advisor 24/7. Worth every penny.",
              },
              {
                name: 'Robert K.',
                role: 'Subscriber since 2024',
                text: "Finally, someone who doesn't apologize for Biblical masculinity. This hub is the complete package.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-red-950/30 to-black border border-red-900/20 rounded-xl"
              >
                <div className="flex items-center gap-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-red-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Move Beyond Theory?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            You've read the emails. Now access the complete framework.
          </p>
          <Link
            href="/?from=substack&action=products"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Enter The Hub Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
