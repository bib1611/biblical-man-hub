/**
 * RADIO ENGAGEMENT TRACKING HOOK
 *
 * Tracks detailed radio listening behavior for analytics
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from './useAnalytics';

export function useRadioEngagement() {
  const { trackEvent } = useAnalytics();
  const [isPlaying, setIsPlaying] = useState(false);
  const sessionStartRef = useRef<number | null>(null);
  const totalListeningTimeRef = useRef(0);
  const currentSessionTimeRef = useRef(0);
  const volumeChangesRef = useRef(0);
  const lastVolumeRef = useRef(1.0);
  const skipsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track listening time while playing
  useEffect(() => {
    if (isPlaying) {
      sessionStartRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        totalListeningTimeRef.current += 1;
        currentSessionTimeRef.current += 1;
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Track session if was playing
      if (sessionStartRef.current !== null && currentSessionTimeRef.current > 0) {
        trackEvent('custom', {
          eventName: 'radio_session_ended',
          sessionDuration: currentSessionTimeRef.current,
          totalListeningTime: totalListeningTimeRef.current,
          timestamp: new Date().toISOString(),
        });

        currentSessionTimeRef.current = 0;
        sessionStartRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Track component unmount (window closed)
  useEffect(() => {
    return () => {
      if (totalListeningTimeRef.current > 0) {
        trackEvent('custom', {
          eventName: 'radio_total_session',
          totalListeningTime: totalListeningTimeRef.current,
          volumeChanges: volumeChangesRef.current,
          skips: skipsRef.current,
        });
      }
    };
  }, []);

  const trackPlayStart = () => {
    setIsPlaying(true);

    trackEvent('custom', {
      eventName: 'radio_play_started',
      timestamp: new Date().toISOString(),
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
    });
  };

  const trackPlayPause = () => {
    setIsPlaying(false);

    trackEvent('custom', {
      eventName: 'radio_paused',
      listeningTime: currentSessionTimeRef.current,
    });
  };

  const trackPlayStop = () => {
    setIsPlaying(false);

    trackEvent('custom', {
      eventName: 'radio_stopped',
      listeningTime: currentSessionTimeRef.current,
    });
  };

  const trackVolumeChange = (newVolume: number) => {
    if (Math.abs(newVolume - lastVolumeRef.current) > 0.1) {
      volumeChangesRef.current += 1;
      lastVolumeRef.current = newVolume;

      trackEvent('custom', {
        eventName: 'radio_volume_changed',
        volume: newVolume,
        volumeChanges: volumeChangesRef.current,
      });
    }
  };

  const trackSkip = () => {
    skipsRef.current += 1;

    trackEvent('custom', {
      eventName: 'radio_skipped',
      skips: skipsRef.current,
      listeningTime: currentSessionTimeRef.current,
    });
  };

  const trackQualityChange = (quality: string) => {
    trackEvent('custom', {
      eventName: 'radio_quality_changed',
      quality,
    });
  };

  const trackStationChange = (station: string) => {
    trackEvent('custom', {
      eventName: 'radio_station_changed',
      station,
      listeningTime: currentSessionTimeRef.current,
    });

    // Reset session time when changing stations
    currentSessionTimeRef.current = 0;
  };

  const trackBackgroundListening = (isBackground: boolean) => {
    trackEvent('custom', {
      eventName: 'radio_background_listening',
      isBackground,
      listeningTime: totalListeningTimeRef.current,
    });
  };

  const trackBingeSession = () => {
    // Track when user has been listening for 30+ minutes straight
    if (currentSessionTimeRef.current >= 1800) {
      trackEvent('custom', {
        eventName: 'radio_binge_session',
        sessionDuration: currentSessionTimeRef.current,
      });
    }
  };

  // Check for binge sessions every 5 minutes
  useEffect(() => {
    const bingeCheckInterval = setInterval(() => {
      if (isPlaying && currentSessionTimeRef.current >= 1800) {
        trackBingeSession();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(bingeCheckInterval);
  }, [isPlaying]);

  return {
    trackPlayStart,
    trackPlayPause,
    trackPlayStop,
    trackVolumeChange,
    trackSkip,
    trackQualityChange,
    trackStationChange,
    trackBackgroundListening,
    totalListeningTime: totalListeningTimeRef.current,
    currentSessionTime: currentSessionTimeRef.current,
    isPlaying,
  };
}
