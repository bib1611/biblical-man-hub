'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Gift, ChevronUp, Phone } from 'lucide-react';

interface StickyMobileCTAProps {
  onEmailCapture: () => void;
  onChatOpen: () => void;
}

export default function StickyMobileCTA({ onEmailCapture, onChatOpen }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show after user scrolls down
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-t from-black via-red-950/95 to-red-900/95 backdrop-blur-md border-t border-red-600/50"
              >
                <div className="p-4 space-y-3">
                  {/* Chat with Sam */}
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onChatOpen();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                  >
                    <MessageCircle size={20} />
                    Chat with Sam - Get Recommendations
                  </button>

                  {/* Free Guide */}
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onEmailCapture();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                  >
                    <Gift size={20} />
                    Get Free 7-Day Challenge
                  </button>

                  {/* Private Counseling */}
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      window.location.href = 'https://gumroad.com/biblical-man/private-counseling';
                    }}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                  >
                    <Phone size={20} />
                    Book Private Counseling
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main CTA Bar */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 backdrop-blur-md border-t border-red-500/50 shadow-2xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="font-bold text-white text-sm mb-0.5">
                  Ready to Transform?
                </div>
                <div className="text-red-100 text-xs">
                  Get your free guide now
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onEmailCapture}
                  className="px-6 py-3 bg-white text-red-900 font-bold rounded-lg active:scale-95 transition-transform shadow-lg"
                >
                  Start Free
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ChevronUp
                    size={24}
                    className={`text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
