'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, ArrowRight, Mail, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
    const timer = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center px-4">
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                top: '-10%',
                left: `${Math.random() * 100}%`,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#dc2626', '#f59e0b', '#22c55e', '#3b82f6'][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-24 h-24 mx-auto mb-8 bg-green-500/20 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full mb-6">
            <Crown className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-medium">Premium Member</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to the Brotherhood
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Your payment was successful. You now have full access to all premium content.
            Check your email for your welcome message and first devotional.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
            <Mail className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Check Your Email</h3>
            <p className="text-sm text-gray-500">Welcome email + first devotional incoming</p>
          </div>
          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
            <BookOpen className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Start a Study Plan</h3>
            <p className="text-sm text-gray-500">7-day transformation guides await</p>
          </div>
          <div className="p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
            <Users className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Join Community</h3>
            <p className="text-sm text-gray-500">Connect with like-minded men</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Enter The Hub
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-gray-500 text-sm"
        >
          Questions? Email us at support@thebiblicalmantruth.com
        </motion.p>
      </div>
    </div>
  );
}
