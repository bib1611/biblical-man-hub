'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { featuredTestimonials } from '@/lib/data/testimonials';

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return featuredTestimonials.length - 1;
      if (next >= featuredTestimonials.length) return 0;
      return next;
    });
  };

  const testimonial = featuredTestimonials[currentIndex];

  return (
    <div className="bg-gradient-to-br from-red-950/40 to-black/60 border border-red-900/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Background quote mark */}
      <div className="absolute top-4 right-4 opacity-5">
        <Quote size={120} className="text-red-500" />
      </div>

      {/* Stars */}
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={20} className="text-amber-500 fill-amber-500" />
        ))}
      </div>

      {/* Testimonial Content */}
      <div className="relative min-h-[180px] md:min-h-[150px] mb-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-4 italic">
              "{testimonial.content}"
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-red-100">{testimonial.name}</div>
                <div className="text-xs text-gray-500">Paid Subscriber</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => paginate(-1)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-colors active:scale-95"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {featuredTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-red-500 w-6'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-colors active:scale-95"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
