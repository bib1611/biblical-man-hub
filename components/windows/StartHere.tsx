'use client';

import { motion } from 'framer-motion';
import { BookOpen, Download, Radio, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function StartHere() {
  const steps = [
    {
      icon: Download,
      title: '1. Get Your Free Biblical Guides',
      description: 'Start with our most popular free resources that have transformed thousands of marriages and lives.',
      cta: 'Download Free Guides',
      action: () => window.dispatchEvent(new CustomEvent('open-window', { detail: 'products' })),
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: BookOpen,
      title: '2. Read Top Articles',
      description: 'Dive into our most impactful teachings on biblical manhood, marriage headship, and uncomfortable truths.',
      cta: 'View Recent Articles',
      action: () => window.dispatchEvent(new CustomEvent('open-window', { detail: 'counseling' })),
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Radio,
      title: '3. Listen to The King\'s Radio',
      description: 'Stream live biblical teaching 24/7. Biblical truth without compromise.',
      cta: 'Start Listening',
      action: () => window.dispatchEvent(new CustomEvent('open-window', { detail: 'radio' })),
      color: 'from-red-600 to-orange-600',
    },
    {
      icon: MessageCircle,
      title: '4. Chat with Sam (AI Assistant)',
      description: 'Get personalized guidance on biblical masculinity, marriage, and faith. Available 24/7.',
      cta: 'Start Chat',
      action: () => window.dispatchEvent(new CustomEvent('open-window', { detail: 'sam' })),
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-950/20 via-black/60 to-purple-950/20 text-gray-100">
      {/* Hero */}
      <div className="relative border-b border-blue-900/30 bg-gradient-to-r from-blue-900/40 to-black/60 p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to The Biblical Man Truth
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-6">
              Your roadmap to biblical manhood starts here
            </p>
            <div className="inline-block px-6 py-3 bg-blue-600/20 border border-blue-600/50 rounded-xl">
              <p className="text-gray-300">
                <span className="font-bold text-blue-300">20,000+ men</span> are already on this journey. Join us.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 bg-gradient-to-r from-blue-950/40 to-purple-950/40 rounded-xl border border-blue-900/30"
        >
          <h2 className="text-2xl font-bold text-white mb-4">What You'll Find Here</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h3 className="font-bold text-blue-300 mb-2">Uncomfortable Truth</h3>
              <p className="text-sm">We don't water down Scripture. Expect biblical teaching that challenges modern Christianity.</p>
            </div>
            <div>
              <h3 className="font-bold text-purple-300 mb-2">Practical Application</h3>
              <p className="text-sm">Not just theory—real-world guidance for your marriage, family, and spiritual leadership.</p>
            </div>
            <div>
              <h3 className="font-bold text-pink-300 mb-2">A Brotherhood</h3>
              <p className="text-sm">Join thousands of Christian men who refuse to compromise on God's Word.</p>
            </div>
          </div>
        </motion.div>

        {/* Step-by-Step Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Next Steps</h2>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <div className="p-6 bg-gradient-to-br from-gray-900/60 to-black/40 border border-gray-700/30 rounded-xl hover:border-blue-600/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center`}>
                        <Icon size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400 mb-4">{step.description}</p>
                        <button
                          onClick={step.action}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all group-hover:scale-105"
                        >
                          {step.cta}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="p-8 bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-xl border-2 border-red-600/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't Miss Daily Biblical Truth
            </h2>
            <p className="text-xl text-gray-200 mb-2">
              Join 20,000+ men receiving daily teaching in their inbox
            </p>
            <p className="text-sm text-gray-300 mb-6 italic">
              "Stop being soft. Stop compromising Scripture. Start leading like the man God called you to be."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://biblicalman.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white hover:bg-gray-100 text-red-900 rounded-lg font-bold text-lg transition-all shadow-xl transform hover:scale-105"
              >
                Subscribe for Free →
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'products' }))}
                className="px-8 py-4 bg-transparent hover:bg-white/10 border-2 border-white text-white rounded-lg font-bold text-lg transition-all"
              >
                Browse Free Resources
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'about' }))}
              className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-gray-300 transition-all"
            >
              About Us
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'products' }))}
              className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-gray-300 transition-all"
            >
              All Products
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'contact' }))}
              className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 rounded-lg text-sm text-gray-300 transition-all"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
