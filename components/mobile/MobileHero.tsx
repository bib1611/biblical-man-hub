'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users } from 'lucide-react';
import { getAnalytics } from '@/lib/analytics';

interface MobileHeroProps {
  onEmailCapture: () => void;
  onEnterHub: () => void;
}

export default function MobileHero({ onEmailCapture, onEnterHub }: MobileHeroProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const analytics = getAnalytics();
      await analytics.captureEmail(email, undefined, 'hero_quick_capture');

      localStorage.setItem('biblical_man_email_captured', 'true');

      // Redirect to free resource
      window.location.href = 'https://biblicalman.gumroad.com/l/onboc';
    } catch (error) {
      console.error('Email capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-6 pt-12 pb-20">
        {/* Social Proof */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full border-2 border-black flex items-center justify-center"
              >
                <Users size={14} className="text-white" />
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            <span className="text-red-400 font-bold">5,247+</span> members
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/50">
            <span className="text-4xl font-bold text-white">†</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-center text-red-100 mb-4 leading-tight"
        >
          Stop Being A
          <br />
          <span className="text-red-500">Weak Christian Man</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 text-center mb-8 leading-relaxed"
        >
          Get the raw, unfiltered Biblical truth they won't preach in church
        </motion.p>

        {/* Quick Email Capture */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleQuickCapture}
          className="max-w-md mx-auto mb-6"
        >
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-red-900/50"
            >
              {isSubmitting ? '...' : <ArrowRight size={24} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Get instant access to the 7-day challenge
          </p>
        </motion.form>

        {/* Rating */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="text-amber-500 fill-amber-500" />
            ))}
          </div>
          <span className="text-sm text-gray-400">4.9/5 from 1,247 reviews</span>
        </motion.div>

        {/* Alternative CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onEnterHub}
          className="w-full max-w-md mx-auto block py-4 bg-white/5 border border-white/20 hover:bg-white/10 rounded-xl font-semibold text-white transition-all active:scale-95 mb-6"
        >
          Or Browse Resources →
        </motion.button>

        {/* Trust Indicators */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">5,000+</div>
            <div className="text-xs text-gray-500">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">32</div>
            <div className="text-xs text-gray-500">Free Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">24/7</div>
            <div className="text-xs text-gray-500">AI Assistant</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
