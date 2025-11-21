'use client';

import { useEffect, useRef } from 'react';
import { useRadioStore } from '@/lib/store/radio';

export default function GlobalAudioProvider() {
    const { isPlaying, volume, isMuted, streamUrl, setIsPlaying } = useRadioStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Handle stream URL changes (pause, update src, restart if was playing)
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;

            // Pause current stream
            if (!audioRef.current.paused) {
                audioRef.current.pause();
            }

            // Update source
            audioRef.current.src = streamUrl;
            audioRef.current.load();

            // Resume if was playing
            if (wasPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.error("Stream change playback error:", error);
                    });
                }
            }
        }
    }, [streamUrl]);

    // Handle play/pause state changes
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
