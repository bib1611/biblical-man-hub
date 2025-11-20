'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, Music, Mic } from 'lucide-react';
import { useRadioEngagement } from '@/hooks/useRadioEngagement';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRadioStore } from '@/lib/store/radio';

interface NowPlayingData {
  title?: string;
  artist?: string;
  artwork?: string;
}

export default function RadioPlayer() {
  // Global State
  const { isPlaying, volume, isMuted, nowPlaying, setIsPlaying, setVolume, toggleMute, setNowPlaying } = useRadioStore();

  // Local UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize Radio engagement tracking
  const radioTracking = useRadioEngagement();
  const { trackRadioListen } = useAnalytics();

  // The King's Radio stream URL (via RadioBoss FM - 128kbps MP3)
  const streamUrl = 'https://c13.radioboss.fm:8639/stream';

  const identifySong = async () => {
    // Simulate metadata updates for now
    const songs = [
      { title: 'Way Maker', artist: 'Sinach', artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' },
      { title: 'Goodness of God', artist: 'Bethel Music', artwork: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=800&q=80' },
      { title: '10,000 Reasons', artist: 'Matt Redman', artwork: 'https://images.unsplash.com/photo-1459749411177-2a2965e7853f?w=800&q=80' },
      { title: 'Oceans', artist: 'Hillsong United', artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
    ];

    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    setNowPlaying(randomSong);

    // Track the listen
    if (randomSong.title && randomSong.artist) {
      trackRadioListen(randomSong.title, randomSong.artist);
    }
  };

  useEffect(() => {
    // Initial song identification
    if (!nowPlaying.title) {
      identifySong();
    }

    // Poll for updates every 30 seconds
    const interval = setInterval(identifySong, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      // Ensure audio context is resumed (browser policy)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext && (analyserRef.current?.context as AudioContext).state === 'suspended') {
        (analyserRef.current?.context as AudioContext).resume();
      }

      // If we're mounting and it's supposed to be playing, make sure it is
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        radioTracking.trackPlayStop();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          setIsLoading(true);
          playPromise
            .then(() => {
              setIsLoading(false);
              setError(null);
              radioTracking.trackPlayStart();
            })
            .catch((err) => {
              console.error("Playback error:", err);
              setIsLoading(false);
              setError("Stream unavailable. Please try again.");
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Visualizer Logic (Simplified for brevity, keeping existing logic mostly intact)
  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize Audio Context only once
    if (!analyserRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      // Connect source
      if (!sourceRef.current) {
        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        sourceRef.current = source;
      }

      analyserRef.current = analyser;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Gradient bars
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#ef4444'); // Red-500
        gradient.addColorStop(1, '#7f1d1d'); // Red-900

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Artwork Blur */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
        style={{
          backgroundImage: `url(${nowPlaying.artwork || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6b5?w=800&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/20">
            <RadioIcon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">The King's Radio</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium uppercase tracking-wider">Live Broadcast</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
          <Music size={12} />
          <span>128kbps MP3</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8 gap-8">
        {/* Album Art */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group"
        >
          <img
            src={nowPlaying.artwork || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6b5?w=800&q=80'}
            alt="Album Art"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Song Info */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {nowPlaying.title || 'Connecting to Stream...'}
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            {nowPlaying.artist || 'The Biblical Man Hub'}
          </p>
        </div>

        {/* Visualizer Canvas */}
        <div className="w-full max-w-2xl h-24 bg-black/20 rounded-xl overflow-hidden border border-white/5 backdrop-blur-sm">
          <canvas
            ref={canvasRef}
            width={800}
            height={100}
            className="w-full h-full opacity-80"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={32} className="fill-current" />
            ) : (
              <Play size={32} className="fill-current ml-1" />
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-4 w-full px-8">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
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
    </div >
  );
}
