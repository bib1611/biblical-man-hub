'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift } from 'lucide-react';
import { getAnalytics } from '@/lib/analytics';

interface EmailCaptureModalProps {
  trigger?: 'timer' | 'exit' | 'manual';
  delay?: number;
}

export default function EmailCaptureModal({ trigger = 'timer', delay = 30000 }: EmailCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already submitted
    if (localStorage.getItem('biblical_man_email_captured')) {
      return;
    }

    if (trigger === 'timer') {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);

      return () => clearTimeout(timer);
    }

    if (trigger === 'exit') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [trigger, delay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const analytics = getAnalytics();
      await analytics.captureEmail(email, name, 'email_capture');

      // Mark as captured
      localStorage.setItem('biblical_man_email_captured', 'true');

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Email capture error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Don't show again this session
    sessionStorage.setItem('email_modal_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-gradient-to-br from-red-950/90 to-black border border-red-900/50 rounded-2xl p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <Gift size={32} className="text-white" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-red-100 mb-4">
                  Get Your Free Resources
                </h2>

                {/* Subheading */}
                <p className="text-center text-gray-300 mb-6">
                  Join 5,000+ men getting unfiltered Biblical truth weekly. Plus instant access to our
                  most popular guides.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold text-white transition-all disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Get Instant Access'}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Unsubscribe anytime. No spam. Ever.
                </p>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Check Your Email!</h3>
                  <p className="text-gray-300">
                    We just sent you your free resources. Check your inbox (and spam folder).
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
