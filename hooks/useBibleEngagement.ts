/**
 * BIBLE ENGAGEMENT TRACKING HOOK
 *
 * Tracks detailed Bible reading behavior for analytics
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from './useAnalytics';

export function useBibleEngagement(book: string, chapter: number) {
  const { trackEvent } = useAnalytics();
  const [startTime] = useState(Date.now());
  const readingTimeRef = useRef(0);
  const versesReadRef = useRef<Set<string>>(new Set());
  const scrollDepthRef = useRef(0);
  const lastActiveRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track chapter start
  useEffect(() => {
    trackEvent('custom', {
      eventName: 'bible_chapter_opened',
      book,
      chapter,
      timestamp: new Date().toISOString(),
    });

    // Start tracking session
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceActive = now - lastActiveRef.current;

      // Only count as reading time if actively engaged (within last 5 seconds)
      if (timeSinceActive < 5000) {
        readingTimeRef.current += 1;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Track session end
      trackEvent('custom', {
        eventName: 'bible_chapter_closed',
        book,
        chapter,
        readingTime: readingTimeRef.current,
        versesRead: Array.from(versesReadRef.current),
        scrollDepth: scrollDepthRef.current,
        sessionDuration: Math.floor((Date.now() - startTime) / 1000),
      });
    };
  }, [book, chapter]);

  // Track verse read
  const trackVerseRead = (verse: number) => {
    const verseRef = `${book} ${chapter}:${verse}`;
    if (!versesReadRef.current.has(verseRef)) {
      versesReadRef.current.add(verseRef);
      lastActiveRef.current = Date.now();

      trackEvent('custom', {
        eventName: 'bible_verse_read',
        verseRef,
        book,
        chapter,
        verse,
      });
    }
  };

  // Track highlight
  const trackHighlight = (verse: number, color: string) => {
    const verseRef = `${book} ${chapter}:${verse}`;
    lastActiveRef.current = Date.now();

    trackEvent('custom', {
      eventName: 'bible_verse_highlighted',
      verseRef,
      book,
      chapter,
      verse,
      color,
    });
  };

  // Track note
  const trackNote = (verse: number, noteLength: number) => {
    const verseRef = `${book} ${chapter}:${verse}`;
    lastActiveRef.current = Date.now();

    trackEvent('custom', {
      eventName: 'bible_note_added',
      verseRef,
      book,
      chapter,
      verse,
      noteLength,
    });
  };

  // Track audio playback
  const trackAudioStart = (audioId: string) => {
    lastActiveRef.current = Date.now();

    trackEvent('custom', {
      eventName: 'bible_audio_started',
      book,
      chapter,
      audioId,
    });
  };

  const trackAudioEnd = (audioId: string, listeningTime: number) => {
    trackEvent('custom', {
      eventName: 'bible_audio_completed',
      book,
      chapter,
      audioId,
      listeningTime,
    });
  };

  // Track search
  const trackSearch = (query: string, resultsCount: number) => {
    lastActiveRef.current = Date.now();

    trackEvent('custom', {
      eventName: 'bible_search',
      query,
      resultsCount,
      book,
      chapter,
    });
  };

  // Track scroll depth
  const trackScroll = (depth: number) => {
    if (depth > scrollDepthRef.current) {
      scrollDepthRef.current = depth;
      lastActiveRef.current = Date.now();

      if (depth >= 25 && depth < 30) {
        trackEvent('custom', { eventName: 'bible_scroll_25', book, chapter });
      } else if (depth >= 50 && depth < 55) {
        trackEvent('custom', { eventName: 'bible_scroll_50', book, chapter });
      } else if (depth >= 75 && depth < 80) {
        trackEvent('custom', { eventName: 'bible_scroll_75', book, chapter });
      } else if (depth >= 100) {
        trackEvent('custom', { eventName: 'bible_scroll_100', book, chapter });
      }
    }
  };

  return {
    trackVerseRead,
    trackHighlight,
    trackNote,
    trackAudioStart,
    trackAudioEnd,
    trackSearch,
    trackScroll,
  };
}
