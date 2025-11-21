'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

interface RadioVisualizationProps {
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RadioVisualization({ isPlaying, size = 'lg' }: RadioVisualizationProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-72 h-72 md:w-96 md:h-96'
  };

  // Generate multiple concentric circles with different animation speeds
  const circles = [
    { delay: 0, duration: 3, scale: 1.5, opacity: 0.3 },
    { delay: 0.5, duration: 3.5, scale: 1.8, opacity: 0.25 },
    { delay: 1, duration: 4, scale: 2.1, opacity: 0.2 },
    { delay: 1.5, duration: 4.5, scale: 2.4, opacity: 0.15 },
  ];

  // Audio bars animation
  const bars = Array.from({ length: 32 }, (_, i) => ({
    delay: i * 0.05,
    duration: 0.8 + Math.random() * 0.4,
    height: 20 + Math.random() * 60,
  }));

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-red-600/20 to-transparent rounded-full blur-3xl" />

      {/* Pulsing radio waves (concentric circles) */}
      {isPlaying && circles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-red-500"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: circle.scale,
            opacity: [0, circle.opacity, 0],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Center radio icon with rotating rings */}
      <div className="relative z-10">
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0 -m-12 rounded-full border-2 border-red-500/30"
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Main radio icon container */}
        <motion.div
          className="relative bg-gradient-to-br from-zinc-900 to-black p-12 rounded-full border-4 border-red-600/40 shadow-2xl"
          animate={isPlaying ? {
            boxShadow: [
              '0 0 40px rgba(220, 38, 38, 0.3)',
              '0 0 60px rgba(220, 38, 38, 0.5)',
              '0 0 40px rgba(220, 38, 38, 0.3)',
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Radio icon */}
          <Radio size={size === 'lg' ? 80 : size === 'md' ? 60 : 40} className="text-red-500" />

          {/* Live indicator dot */}
          {isPlaying && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-black"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Rotating inner ring (opposite direction) */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full border border-red-500/20"
          animate={isPlaying ? { rotate: -360 } : {}}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Bottom audio spectrum visualizer */}
      {isPlaying && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12 w-48">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-red-600 to-red-400 rounded-full"
              initial={{ height: 4 }}
              animate={{
                height: [4, bar.height, 4],
              }}
              transition={{
                duration: bar.duration,
                delay: bar.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle particle effects */}
      {isPlaying && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                opacity: [0.8, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
