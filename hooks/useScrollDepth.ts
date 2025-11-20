'use client';

import { useEffect, useState } from 'react';

export function useScrollDepth(thresholds: number[] = [25, 50, 75, 100]) {
    const [maxDepth, setMaxDepth] = useState(0);
    const [currentDepth, setCurrentDepth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;

            const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);

            setCurrentDepth(scrollPercent);

            if (scrollPercent > maxDepth) {
                setMaxDepth(scrollPercent);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [maxDepth]);

    // Helper to check if a specific threshold has been reached
    const hasReached = (depth: number) => maxDepth >= depth;

    return { currentDepth, maxDepth, hasReached };
}
