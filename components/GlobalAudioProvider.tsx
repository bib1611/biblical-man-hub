'use client';

import { useEffect, useRef } from 'react';
import { useRadioStore } from '@/lib/store/radio';

export default function GlobalAudioProvider() {
    const { isPlaying, volume, isMuted, setIsPlaying } = useRadioStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const streamUrl = 'https://c13.radioboss.fm:8639/stream';

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying) {
            if (audioRef.current && audioRef.current.paused) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.error("Global Audio Playback Error:", error);
                        // If auto-play fails (e.g. no user interaction), we might need to reset state
                        // setIsPlaying(false); 
                    });
                }
            }
        } else {
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <audio
            ref={audioRef}
            src={streamUrl}
            crossOrigin="anonymous"
            preload="none"
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
                console.error("Global Audio Error:", e);
                setIsPlaying(false);
            }}
        />
    );
}
