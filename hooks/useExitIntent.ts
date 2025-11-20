'use client';

import { useEffect, useRef, useState } from 'react';

interface ExitIntentOptions {
    threshold?: number; // Mouse distance from top of screen (pixels)
    mobileDelay?: number; // Delay for mobile back button detection (ms)
    enabled?: boolean;
}

export function useExitIntent(options: ExitIntentOptions = {}) {
    const { threshold = 50, mobileDelay = 100, enabled = true } = options;
    const [isExitIntent, setIsExitIntent] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const mouseSpeed = useRef(0);
    const lastMousePosition = useRef<{ x: number; y: number; time: number } | null>(null);

    useEffect(() => {
        if (!enabled || hasTriggered) return;

        // 🖱️ DESKTOP: Mouse leaving viewport or moving fast towards top
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();

            // Calculate mouse velocity
            if (lastMousePosition.current) {
                const dx = e.clientX - lastMousePosition.current.x;
                const dy = e.clientY - lastMousePosition.current.y;
                const dt = now - lastMousePosition.current.time;
                if (dt > 0) {
                    const speed = Math.sqrt(dx * dx + dy * dy) / dt; // pixels per ms
                    mouseSpeed.current = speed;
                }
            }
            lastMousePosition.current = { x: e.clientX, y: e.clientY, time: now };

            // Trigger if mouse is near top AND moving up
            if (e.clientY < threshold && e.movementY < 0) {
                triggerExitIntent();
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                triggerExitIntent();
            }
        };

        // 📱 MOBILE: Back button or history change
        const handleHistoryChange = () => {
            // This is a bit of a hack, as browsers limit access to history
            // We can try to intercept popstate
            triggerExitIntent();
        };

        const triggerExitIntent = () => {
            if (!hasTriggered) {
                setIsExitIntent(true);
                setHasTriggered(true);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('popstate', handleHistoryChange);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('popstate', handleHistoryChange);
        };
    }, [enabled, hasTriggered, threshold]);

    const reset = () => {
        setIsExitIntent(false);
        setHasTriggered(false);
    };

    return { isExitIntent, reset };
}
