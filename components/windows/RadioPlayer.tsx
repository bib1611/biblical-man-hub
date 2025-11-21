'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Heart, MoreHorizontal, Crown } from 'lucide-react';
import { useRadioEngagement } from '@/hooks/useRadioEngagement';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRadioStore } from '@/lib/store/radio';
import { useSession } from '@/lib/contexts/SessionContext';
import RadioVisualization from '@/components/RadioVisualization';

interface NowPlayingData {
  title?: string;
  artist?: string;
  artwork?: string;
}

interface RadioFeed {
  id: string;
  name: string;
  streamUrl: string;
  isPremium: boolean;
  description: string;
  quality: string;
}

const RADIO_FEEDS: RadioFeed[] = [
  {
    id: 'free',
    name: 'The King\'s Radio',
    streamUrl: 'https://c13.radioboss.fm:8639/stream',
    isPremium: false,
    description: 'Biblical teaching & worship music',
    quality: '128kbps',
  },
];

export default function RadioPlayer() {
  // Global State
  const {
    isPlaying,
    volume,
    isMuted,
    nowPlaying,
    streamUrl,
    currentFeed: savedFeedId,
    setIsPlaying,
    setVolume,
    toggleMute,
    setNowPlaying,
    setStreamUrl,
    setCurrentFeed: setSavedFeedId
  } = useRadioStore();

  // Local UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  // Get current feed
  const currentFeed = RADIO_FEEDS[0];

  // Initialize Radio engagement tracking
  const radioTracking = useRadioEngagement();
  const { trackRadioListen } = useAnalytics();
  const { user, login } = useSession();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user?.preferences?.isMember) {
      setHasPremiumAccess(true);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('loading');
    const success = await login(loginEmail);
    if (success) {
      setLoginStatus('success');
      setTimeout(() => {
        setIsLoggingIn(false);
        setHasPremiumAccess(true);
      }, 1500);
    } else {
      setLoginStatus('error');
    }
  };

  const identifySong = async (streamUrl: string) => {
    try {
      const response = await fetch('/api/identify-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamUrl }),
      });

      const data = await response.json();

      if (data.success && data.title) {
        const songData = {
          title: data.title,
          artist: data.artist || 'The King\'s Radio',
          artwork: data.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
        };

        setNowPlaying(songData);

        // Track the listen
        trackRadioListen(songData.title, songData.artist);
      }
    } catch (error) {
      console.error('Failed to identify song:', error);
      // Fallback to default
      setNowPlaying({
        title: 'Live Broadcast',
        artist: currentFeed.name,
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      });
    }
  };

  useEffect(() => {
    // Initial song identification
    if (!nowPlaying.title) {
      identifySong(currentFeed.streamUrl);
    }

    // Poll for updates every 30 seconds
    const interval = setInterval(() => identifySong(currentFeed.streamUrl), 30000);
    return () => clearInterval(interval);
  }, [currentFeed]);

  // Volume and playback are now controlled by GlobalAudioProvider
  // No local audio element needed

  const togglePlay = () => {
    // Toggle playback (GlobalAudioProvider handles the actual audio element)
    if (isPlaying) {
      radioTracking.trackPlayStop();
    } else {
      setIsLoading(true);
      radioTracking.trackPlayStart();
      // Loading will be set to false after play starts
      setTimeout(() => setIsLoading(false), 1000);
    }
    setIsPlaying(!isPlaying);
  };

  // Removed channel switching - single stream only

  // Apple Music Style Layout
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-auto">
      {/* Background Artwork Blur - Apple Music style */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          backgroundImage: `url(${nowPlaying.artwork || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6b5?w=800&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Main Content - Apple Music Layout */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 md:p-8 max-w-3xl mx-auto w-full">

        {/* Live Badge */}
        <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Live Broadcast</span>
        </div>

        {/* Animated Radio Visualization */}
        <div className="relative mb-12">
          <RadioVisualization isPlaying={isPlaying} size="lg" />
        </div>

        {/* Song Info - Apple Music typography */}
        <div className="text-center mb-6 w-full">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">
            {nowPlaying.title || 'The King\'s Radio'}
          </h1>
          <p className="text-lg text-red-400 font-medium">
            {nowPlaying.artist || 'Live Biblical Teaching'}
          </p>
        </div>

        {/* Action Buttons - Apple Music style */}
        <div className="flex items-center gap-6 mb-8">
          <button className="text-gray-400 hover:text-red-400 transition-colors">
            <Heart size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Controls - Apple Music layout */}
        <div className="w-full max-w-md space-y-6">

          {/* Play/Pause Button - Apple Music style */}
          <div className="flex items-center justify-center gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              disabled={isLoading}
              className="w-16 h-16 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={28} className="text-black" fill="currentColor" />
              ) : (
                <Play size={28} className="text-black ml-1" fill="currentColor" />
              )}
            </motion.button>
          </div>

          {/* Volume Control - Apple Music style */}
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>

            <div className="flex-1 relative h-1 bg-gray-700 rounded-full overflow-hidden group cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                setVolume(Math.max(0, Math.min(1, percentage)));
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${volume * 100}% - 6px)` }}
              />
            </div>

            <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
              {Math.round(volume * 100)}
            </span>
          </div>

          {/* Stream Quality Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Music size={12} />
            <span>{currentFeed.quality} • {currentFeed.isPremium ? 'Premium' : 'Free'}</span>
          </div>
        </div>
      </div>

      {/* Support Section - Apple Music style bottom sheet */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-b from-zinc-900/80 to-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto p-6">
          {!hasPremiumAccess && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-br from-yellow-950/30 to-transparent rounded-2xl border border-yellow-900/20 mb-4">
              <div className="text-center md:text-left">
                <h3 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2 justify-center md:justify-start">
                  <Crown size={16} className="text-yellow-500" />
                  Upgrade to Premium
                </h3>
                <p className="text-sm text-gray-400">
                  Ad-free listening • Higher quality • Exclusive content
                </p>
                <button
                  onClick={() => setIsLoggingIn(!isLoggingIn)}
                  className="text-xs text-yellow-500 hover:text-yellow-400 underline mt-2"
                >
                  Already a member? Login here
                </button>
              </div>

              {isLoggingIn ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="px-4 py-2 bg-black/50 border border-yellow-900/50 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loginStatus === 'loading'}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loginStatus === 'loading' ? 'Checking...' : 'Access Account'}
                  </button>
                  {loginStatus === 'error' && (
                    <p className="text-xs text-red-400">Email not found or not a member.</p>
                  )}
                  {loginStatus === 'success' && (
                    <p className="text-xs text-green-400">Welcome back, brother.</p>
                  )}
                </form>
              ) : (
                <a
                  href="https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Crown size={18} />
                  Get Premium
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-br from-red-950/30 to-transparent rounded-2xl border border-red-900/20">
            <div className="text-center md:text-left">
              <h3 className="text-base font-semibold text-white mb-1.5 flex items-center gap-2 justify-center md:justify-start">
                <Heart size={16} className="text-red-500" />
                Support The King's Radio
              </h3>
              <p className="text-sm text-gray-400">
                Help keep Biblical truth broadcasting 24/7
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
              >
                Give Now
              </a>
              <a
                href="https://biblicalman.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
              >
                Subscribe
              </a>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Biblical Teaching • Powered by RadioBoss FM</p>
          </div>
        </div>
      </div>

      {/* Audio is handled by GlobalAudioProvider - no local audio element */}
    </div>
  );
}
