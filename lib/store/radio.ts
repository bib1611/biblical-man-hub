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

    // Actions
    setIsPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setNowPlaying: (data: NowPlayingData) => void;
}

export const useRadioStore = create<RadioState>()(
    persist(
        (set) => ({
            isPlaying: false,
            volume: 0.8,
            isMuted: false,
            nowPlaying: {},

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setVolume: (volume) => set({ volume }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setNowPlaying: (nowPlaying) => set({ nowPlaying }),
        }),
        {
            name: 'radio-storage',
            partialize: (state) => ({ volume: state.volume, isMuted: state.isMuted }), // Only persist volume/mute preferences
        }
    )
);
