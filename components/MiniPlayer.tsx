'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Radio, Music } from 'lucide-react';
import { useRadioStore } from '@/lib/store/radio';
import { useRadioEngagement } from '@/hooks/useRadioEngagement';

interface MiniPlayerProps {
    onExpand: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
    const { isPlaying, nowPlaying, setIsPlaying } = useRadioStore();
    const radioTracking = useRadioEngagement();

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();

        // We need to access the audio element which is mounted in RadioPlayer
        // Since we can't directly access the ref from here, we rely on the shared state
        // and the effect in RadioPlayer to handle the actual audio element control.
        // However, RadioPlayer might NOT be mounted if we are in another app.
        // This reveals a flaw in the plan: The <audio> element needs to be global.

        // For now, we will just toggle the state, and we need to move the <audio> element 
        // to a global provider or the DashboardLayout.
        setIsPlaying(!isPlaying);

        if (isPlaying) {
            radioTracking.trackPlayStop();
        } else {
            radioTracking.trackPlayStart();
        }
    };

    if (!nowPlaying.title && !isPlaying) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-4 mb-4 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl cursor-pointer group"
            onClick={onExpand}
        >
            {/* Progress Bar (Fake for live radio) */}
            {isPlaying && (
                <div className="h-0.5 w-full bg-gray-800">
                    <motion.div
                        className="h-full bg-red-500"
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}

            <div className="p-3 flex items-center gap-3">
                {/* Album Art */}
                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                    {nowPlaying.artwork ? (
                        <img
                            src={nowPlaying.artwork}
                            alt="Album Art"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Radio size={16} className="text-gray-400" />
                        </div>
                    )}
                    {/* Playing Indicator */}
                    {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex gap-0.5 items-end h-3">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                                <motion.div animate={{ height: [8, 4, 12] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                                <motion.div animate={{ height: [6, 10, 6] }} transition={{ duration: 0.4, repeat: Infinity }} className="w-0.5 bg-white rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                        {nowPlaying.title || "The King's Radio"}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate">
                        {nowPlaying.artist || "Live Broadcast"}
                    </p>
                </div>

                {/* Controls */}
                <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                    {isPlaying ? (
                        <Pause size={14} className="fill-current" />
                    ) : (
                        <Play size={14} className="fill-current ml-0.5" />
                    )}
                </button>
            </div>
        </motion.div>
    );
}
