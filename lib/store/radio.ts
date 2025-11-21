import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NowPlayingData {
    title?: string;
    artist?: string;
    artwork?: string;
}

interface RadioState {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    nowPlaying: NowPlayingData;
    streamUrl: string;
    currentFeed: string; // 'free' or 'premium'

    // Actions
    setIsPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setNowPlaying: (data: NowPlayingData) => void;
    setStreamUrl: (url: string) => void;
    setCurrentFeed: (feedId: string) => void;
}

export const useRadioStore = create<RadioState>()(
    persist(
        (set) => ({
            isPlaying: false,
            volume: 0.8,
            isMuted: false,
            nowPlaying: {},
            streamUrl: 'https://c13.radioboss.fm:8639/stream', // Default free stream
            currentFeed: 'free',

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setVolume: (volume) => set({ volume }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setNowPlaying: (nowPlaying) => set({ nowPlaying }),
            setStreamUrl: (streamUrl) => set({ streamUrl }),
            setCurrentFeed: (currentFeed) => set({ currentFeed }),
        }),
        {
            name: 'radio-storage',
            partialize: (state) => ({
                volume: state.volume,
                isMuted: state.isMuted,
                currentFeed: state.currentFeed
            }), // Persist volume/mute preferences and selected feed
        }
    )
);
