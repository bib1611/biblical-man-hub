'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialTicker() {
  // Short, punchy testimonials for the ticker
  const tickerTestimonials = [
    { name: 'Vivian', text: 'radical christianity, as it should be!' },
    { name: 'Brady Silas', text: 'God is clearly speaking through your words' },
    { name: 'Becky', text: "You're fearless, spiritually-unafraid to tell the truth" },
    { name: 'David Gerry', text: 'Bold clarity in representing our Savior' },
    { name: 'Diego', text: 'You are a compelling preacher! You certainly are.' },
    { name: 'Anna', text: 'Destroying false christianity. Thank you.' },
    { name: 'Barbra Jay', text: "You've got me now. I've subscribed." },
    { name: 'Melissa', text: 'Honest and true information by ethical Christians' },
  ];

  // Duplicate for seamless loop
  const duplicatedTestimonials = [...tickerTestimonials, ...tickerTestimonials];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 border-y border-red-900/30 py-4">
      <motion.div
        className="flex gap-8"
        animate={{
          x: [0, -50 * tickerTestimonials.length + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap flex-shrink-0 px-4"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-gray-300 text-sm">
              "{testimonial.text}"
            </span>
            <span className="text-red-400 font-semibold text-sm">
              - {testimonial.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
