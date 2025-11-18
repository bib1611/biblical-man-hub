'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon } from 'lucide-react';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // FFBR stream URL - replace with actual stream URL
  const streamUrl = 'https://stream.ffbr.com/live'; // Placeholder

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950/20 via-black/60 to-orange-950/20 text-gray-100 p-8">
      {/* Radio Icon Animation */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="mb-8"
      >
        <div className="w-40 h-40 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 relative">
          <RadioIcon size={80} className="text-white" />

          {/* Pulse effect when playing */}
          {isPlaying && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-orange-500 rounded-full"
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Station Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-100 mb-2">Final Fight Bible Radio</h1>
        <p className="text-sm text-gray-400 mb-1">
          Uncompromising Biblical Teaching • 24/7 Stream
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span>{isPlaying ? 'LIVE NOW' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause size={32} className="text-white" fill="white" />
          ) : (
            <Play size={32} className="text-white ml-1" fill="white" />
          )}
        </button>

        {/* Volume Control */}
        <div className="w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-black/40 hover:bg-black/60 rounded-lg flex items-center justify-center transition-colors"
            >
              {isMuted ? (
                <VolumeX size={20} className="text-red-400" />
              ) : (
                <Volume2 size={20} className="text-red-400" />
              )}
            </button>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full pointer-events-none"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-12 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Visualizer Bars */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: ['20%', '100%', '20%'],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
                className="w-1.5 bg-gradient-to-t from-red-600 to-orange-500 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-black/40 border border-red-900/30 rounded-lg max-w-md">
        <h3 className="text-sm font-bold text-red-200 mb-2">Now Playing</h3>
        <p className="text-xs text-gray-400">
          This player connects to Final Fight Bible Radio's live stream. Contact FFBR for their
          official stream URL to replace the placeholder.
        </p>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={streamUrl} preload="none" />
    </div>
  );
}
