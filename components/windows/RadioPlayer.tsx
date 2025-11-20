'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, Music, Heart, MoreHorizontal, Lock, Crown, ChevronDown } from 'lucide-react';
import { useRadioEngagement } from '@/hooks/useRadioEngagement';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRadioStore } from '@/lib/store/radio';

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
    name: 'FFBR Free',
    streamUrl: 'https://c13.radioboss.fm:8639/stream',
    isPremium: false,
    description: 'Biblical teaching & worship music',
    quality: '128kbps',
  },
  {
    id: 'premium',
    name: 'FFBR Premium',
    streamUrl: 'https://ffbrmobile.com/premium-stream', // Replace with actual premium stream URL
    isPremium: true,
    description: 'Ad-free, exclusive content, higher quality',
    quality: '320kbps',
  },
];

export default function RadioPlayer() {
  // Global State
  const { isPlaying, volume, isMuted, nowPlaying, setIsPlaying, setVolume, toggleMute, setNowPlaying } = useRadioStore();

  // Local UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFeed, setCurrentFeed] = useState<RadioFeed>(RADIO_FEEDS[0]);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false); // Check if user has paid for premium
  const [showFeedSelector, setShowFeedSelector] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Radio engagement tracking
  const radioTracking = useRadioEngagement();
  const { trackRadioListen } = useAnalytics();

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      // Ensure audio context is resumed (browser policy)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

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
          playPromise
            .then(() => {
              setIsLoading(false);
              radioTracking.trackPlayStart();
            })
            .catch((error) => {
              console.error('Playback failed:', error);
              setError('Failed to play stream');
              setIsLoading(false);
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const switchFeed = (feed: RadioFeed) => {
    if (feed.isPremium && !hasPremiumAccess) {
      // Redirect to payment page
      window.open('https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T', '_blank');
      return;
    }

    // Stop current playback
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    setCurrentFeed(feed);
    setShowFeedSelector(false);

    // If was playing, start new feed
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }

    // Identify new song
    identifySong(feed.streamUrl);
  };

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

        {/* Feed Selector */}
        <div className="mb-4 relative">
          <button
            onClick={() => setShowFeedSelector(!showFeedSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all"
          >
            {currentFeed.isPremium && <Crown size={16} className="text-yellow-500" />}
            <span className="text-sm font-semibold">{currentFeed.name}</span>
            <ChevronDown size={16} className={`transition-transform ${showFeedSelector ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showFeedSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
              >
                {RADIO_FEEDS.map((feed) => (
                  <button
                    key={feed.id}
                    onClick={() => switchFeed(feed)}
                    className={`w-full px-4 py-4 flex items-start gap-3 hover:bg-white/10 transition-colors ${currentFeed.id === feed.id ? 'bg-white/5' : ''
                      }`}
                  >
                    {feed.isPremium ? (
                      hasPremiumAccess ? (
                        <Crown size={20} className="text-yellow-500 mt-0.5" />
                      ) : (
                        <Lock size={20} className="text-gray-400 mt-0.5" />
                      )
                    ) : (
                      <RadioIcon size={20} className="text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {feed.name}
                        {feed.isPremium && !hasPremiumAccess && (
                          <span className="text-xs px-2 py-0.5 bg-red-600 rounded-full">Upgrade</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{feed.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{feed.quality}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Badge */}
        <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Live Broadcast</span>
        </div>

        {/* Album Art - Apple Music style with shadow */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-72 h-72 md:w-96 md:h-96 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 rounded-2xl shadow-2xl shadow-black/60" />
          <img
            src={nowPlaying.artwork || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6b5?w=800&q=80'}
            alt="Album Art"
            className="w-full h-full object-cover rounded-2xl"
          />
          {currentFeed.isPremium && hasPremiumAccess && (
            <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full p-2">
              <Crown size={20} className="text-yellow-500" />
            </div>
          )}
        </motion.div>

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
              </div>
              <a
                href="https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Crown size={18} />
                Get Premium
              </a>
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

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentFeed.streamUrl} preload="none" />
    </div>
  );
}
