'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, Music, Mic } from 'lucide-react';

interface NowPlayingData {
  title?: string;
  artist?: string;
  artwork?: string;
}

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    title: 'Biblical Teaching',
    artist: 'The King\'s Radio',
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // The King's Radio stream URL (via RadioBoss FM - 128kbps MP3)
  const streamUrl = 'https://c13.radioboss.fm:8639/stream';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Song identification with fallback strategy
  useEffect(() => {
    const identifySong = async () => {
      try {
        // Try our backend API which handles Icecast metadata parsing
        const response = await fetch('/api/identify-song', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamUrl }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.title) {
          setNowPlaying({
            title: data.title,
            artist: data.artist || 'The King\'s Radio',
            artwork: data.artwork,
          });
          return; // Successfully identified
        }
      } catch (error) {
        console.error('Song identification failed:', error);
      }

      // If backend fails, keep showing default
      setNowPlaying({
        title: 'Biblical Teaching',
        artist: 'The King\'s Radio',
      });
    };

    // Identify song when playback starts and then every 30 seconds
    if (isPlaying) {
      identifySong();
      const interval = setInterval(identifySong, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isPlaying, streamUrl]);

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
    <div className="min-h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <RadioIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">The King's Radio</h1>
              <p className="text-xs text-gray-400">Live Biblical Teaching</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-400">{isPlaying ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Album Art / Cover */}
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative mb-6 md:mb-8"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 bg-gradient-to-br from-red-900/40 via-black to-orange-900/40 border border-red-900/30">
            {nowPlaying.artwork ? (
              <img
                src={nowPlaying.artwork}
                alt="Now Playing"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                {/* Animated background */}
                {isPlaying && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-red-600/50 to-orange-600/50 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-600/50 to-red-600/50 rounded-full"
                    />
                  </>
                )}

                {/* Center icon */}
                <div className="relative z-10 flex flex-col items-center">
                  <Mic size={80} className="text-red-500 mb-4" />
                  <Music size={40} className="text-orange-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Vinyl Record Effect when playing */}
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full border-4 border-gray-700 opacity-60"
            >
              <div className="absolute inset-2 bg-gradient-to-br from-red-900 to-orange-900 rounded-full" />
              <div className="absolute inset-6 bg-black rounded-full" />
            </motion.div>
          )}
        </motion.div>

        {/* Now Playing Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={nowPlaying.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6 max-w-md"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
              {nowPlaying.title || 'Biblical Teaching'}
            </h2>
            <p className="text-lg text-gray-400">
              {nowPlaying.artist || 'The King\'s Radio'}
            </p>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center justify-center gap-2"
              >
                <div className="h-1 w-1 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">Live Stream</span>
                <div className="h-1 w-1 bg-red-500 rounded-full animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="w-full max-w-md">
          {/* Play/Pause and Volume in one row */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Volume Control */}
            <button
              onClick={toggleMute}
              className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center transition-all"
            >
              {isMuted ? (
                <VolumeX size={20} className="text-gray-300" />
              ) : (
                <Volume2 size={20} className="text-white" />
              )}
            </button>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-20 h-20 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-2xl transition-all"
            >
              {isPlaying ? (
                <Pause size={32} className="text-gray-900" fill="currentColor" />
              ) : (
                <Play size={32} className="text-gray-900 ml-1" fill="currentColor" />
              )}
            </motion.button>

            {/* Volume slider placeholder for symmetry */}
            <div className="w-12 h-12" />
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 px-4">
            <Volume2 size={16} className="text-gray-500" />
            <div className="flex-1 relative group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
              />
              <div
                className="absolute top-0 left-0 h-1 bg-white rounded-full pointer-events-none"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right font-mono">
              {Math.round(volume * 100)}
            </span>
          </div>

          {/* Visualizer Bars */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-1 h-12 mt-6">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ['30%', '100%', '30%'],
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.03,
                  }}
                  className="w-1 bg-gradient-to-t from-red-600 to-white rounded-full"
                  style={{ opacity: 0.6 + Math.random() * 0.4 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800/50 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Support CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/30">
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-white mb-1">
                Support The King's Radio
              </h3>
              <p className="text-xs text-gray-400">
                Help keep Biblical truth on the air
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-semibold text-sm transition-all shadow-lg"
              >
                Give Now
              </a>
              <a
                href="https://biblicalman.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 text-white border border-gray-600/50 rounded-full text-sm font-medium transition-all"
              >
                Subscribe
              </a>
            </div>
          </div>

          {/* Stream Info */}
          <div className="text-center text-xs text-gray-500">
            <p>Biblical Teaching • Stream powered by RadioBoss FM</p>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={streamUrl} preload="none" />
    </div>
  );
}
