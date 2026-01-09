'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, BookOpen, Mail, Zap, Users, Star } from 'lucide-react';

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Mail,
      title: 'Daily AI Devotionals',
      description: 'Wake up to a powerful, personalized devotional in your inbox every morning at 6 AM',
    },
    {
      icon: BookOpen,
      title: 'Premium Study Plans',
      description: '7-day intensive Bible study guides on leadership, marriage, fatherhood, and more',
    },
    {
      icon: Shield,
      title: 'Exclusive Content',
      description: 'Access teachings and resources not available anywhere else',
    },
    {
      icon: Users,
      title: 'Inner Circle Community',
      description: 'Connect with like-minded men committed to biblical transformation',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Direct email access for questions and guidance',
    },
    {
      icon: Crown,
      title: 'Early Access',
      description: 'Be the first to access new courses, books, and resources',
    },
  ];

  const testimonials = [
    {
      name: 'Michael T.',
      role: 'Husband & Father of 3',
      quote: 'The daily devotionals have transformed my morning routine. I\'m finally leading my family spiritually.',
    },
    {
      name: 'James R.',
      role: 'Business Owner',
      quote: 'The 7-day leadership course gave me the confidence to lead at home and at work without apology.',
    },
    {
      name: 'David M.',
      role: 'Pastor',
      quote: 'Finally, content that doesn\'t water down Scripture. This is what Christian men desperately need.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full mb-8">
              <Crown className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm font-medium">Premium Membership</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stop Being a <span className="text-red-500">Passive</span> Christian Man
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the brotherhood of men committed to biblical transformation.
              Daily devotionals, intensive study plans, and exclusive content delivered
              to you automatically.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-12">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Instant access
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                New content daily
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setSelectedPlan('monthly')}
              className={`relative p-8 rounded-2xl cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-gradient-to-b from-red-900/20 to-red-900/5 border-2 border-red-500'
                  : 'bg-[#1a1a1a] border-2 border-gray-800 hover:border-gray-700'
              }`}
            >
              {selectedPlan === 'monthly' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white">
                  SELECTED
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">$19.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Daily AI Devotionals
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Premium Study Plans
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Exclusive Content
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Community Access
                </li>
              </ul>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setSelectedPlan('yearly')}
              className={`relative p-8 rounded-2xl cursor-pointer transition-all ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-b from-red-900/20 to-red-900/5 border-2 border-red-500'
                  : 'bg-[#1a1a1a] border-2 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 rounded-full text-xs font-bold text-white">
                SAVE $40
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-gray-500">/year</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Everything in Monthly
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  2 Months FREE
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Annual Planning Guides
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  Priority Support
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 p-8 bg-[#1a1a1a] rounded-2xl border border-gray-800"
          >
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-4"
              />
              <button
                onClick={handleCheckout}
                disabled={loading || !email}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Start Premium - {selectedPlan === 'monthly' ? '$19.99/mo' : '$199/yr'}
                  </>
                )}
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                Secure payment via Stripe. Cancel anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What You Get as a Premium Member
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800"
              >
                <feature.icon className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Men Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What happens after I subscribe?',
                a: 'You\'ll get immediate access to all premium content. Your first daily devotional arrives the next morning at 6 AM.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.',
              },
              {
                q: 'What if I\'m not satisfied?',
                a: 'We offer a 7-day satisfaction guarantee. If the content isn\'t what you expected, email us and we\'ll refund your payment.',
              },
              {
                q: 'How are devotionals generated?',
                a: 'Our AI generates fresh devotionals daily based on rotating biblical themes - leadership, marriage, fatherhood, and more.',
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Stop Waiting. Start Leading.
          </h2>
          <p className="text-gray-400 mb-8">
            Every day you delay is another day your family goes without the spiritual
            leadership they need. Make the decision now.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Join Premium Now
          </button>
        </div>
      </section>
    </div>
  );
}
