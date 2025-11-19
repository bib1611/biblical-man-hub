'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

interface ExitIntentPopupProps {
  onClose: () => void;
  onEmailSubmit: (email: string) => void;
}

export default function ExitIntentPopup({ onClose, onEmailSubmit }: ExitIntentPopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onEmailSubmit(email);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-gradient-to-br from-red-950/90 to-black border-2 border-red-600/50 rounded-2xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-900/30 hover:bg-red-900/50 transition-colors"
        >
          <X size={16} className="text-red-300" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center">
            <Mail size={32} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Wait! Don't Leave Empty-Handed
          </h2>
          <p className="text-gray-300">
            Join 20,000+ men receiving Biblical truth that transforms marriages, builds wealth, and strengthens faith.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-black/40 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600/80 transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold text-white transition-all disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Get Free Biblical Truth'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-red-900/30">
          <p className="text-sm text-gray-400 text-center">
            <strong className="text-red-400">Bonus:</strong> Get instant access to our free Biblical Leadership Framework
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
