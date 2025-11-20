'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from './useAnalytics';

type Variant = 'A' | 'B' | 'C' | 'D';

interface ABTestOptions {
    testName: string;
    variants?: Variant[];
    weights?: number[]; // e.g. [0.5, 0.5] for 50/50 split
}

export function useABTest({ testName, variants = ['A', 'B'], weights }: ABTestOptions) {
    const [variant, setVariant] = useState<Variant | null>(null);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // Check if user already has a variant assigned in localStorage
        const storageKey = `ab_test_${testName}`;
        const storedVariant = localStorage.getItem(storageKey) as Variant;

        if (storedVariant && variants.includes(storedVariant)) {
            setVariant(storedVariant);
        } else {
            // Assign new variant
            const random = Math.random();
            let cumulativeWeight = 0;
            let assignedVariant: Variant = variants[0];

            if (weights && weights.length === variants.length) {
                // Weighted assignment
                for (let i = 0; i < variants.length; i++) {
                    cumulativeWeight += weights[i];
                    if (random < cumulativeWeight) {
                        assignedVariant = variants[i];
                        break;
                    }
                }
            } else {
                // Equal assignment
                const index = Math.floor(random * variants.length);
                assignedVariant = variants[index];
            }

            localStorage.setItem(storageKey, assignedVariant);
            setVariant(assignedVariant);

            // Track assignment event
            trackEvent('custom', {
                eventName: 'ab_test_assignment',
                testName,
                variant: assignedVariant,
            });
        }
    }, [testName, variants, weights, trackEvent]);

    return variant;
}
