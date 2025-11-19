'use client';

import { useBehavioralTracking } from '@/hooks/useBehavioralTracking';

/**
 * Client-side behavioral tracking wrapper
 * Activated on every page to track all user behavior
 */
export function BehavioralTracker() {
  useBehavioralTracking();
  return null; // This component doesn't render anything
}
