'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, X } from 'lucide-react';

interface StickyMobileCTAProps {
    onChat: () => void;
    onShop: () => void;
}

export default function StickyMobileCTA({ onChat, onShop }: StickyMobileCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible || isDismissed) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] md:hidden animate-fade-in-up pb-[env(safe-area-inset-bottom)]">
            <div className="glass-panel rounded-xl p-3 flex items-center gap-3 shadow-2xl border border-red-500/30 relative backdrop-blur-xl bg-black/80 supports-[backdrop-filter]:bg-black/60">
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute -top-2 -right-2 bg-black border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white"
                >
                    <X size={12} />
                </button>

                <button
                    onClick={onChat}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-bold text-sm transition-colors border border-gray-700"
                >
                    <MessageCircle size={16} className="text-blue-400" />
                    Ask Sam
                </button>

                <button
                    onClick={onShop}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-red-900/50"
                >
                    <ShoppingBag size={16} />
                    Shop Now
                </button>
            </div>
        </div>
    );
}
