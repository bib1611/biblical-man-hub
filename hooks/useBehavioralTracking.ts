/**
 * 🕵️ BEHAVIORAL TRACKING HOOK - "STALKER MODE"
 *
 * Tracks EVERYTHING users do on the site:
 * - Every click, scroll, hover
 * - Rage clicks, dead clicks
 * - Mouse movements (heatmap data)
 * - Form interactions
 * - Copy/paste behavior
 * - Tab visibility
 * - Idle detection
 * - Element visibility
 * - Network performance
 * - JavaScript errors
 *
 * Inspired by FullStory, Hotjar, and Heap analytics
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

interface ClickData {
  x: number;
  y: number;
  timestamp: number;
  element: string;
  count: number;
}

export function useBehavioralTracking() {
  const { trackEvent } = useAnalytics();

  // Track click patterns for rage click detection
  const recentClicks = useRef<ClickData[]>([]);
  const mousePositions = useRef<{ x: number; y: number; timestamp: number }[]>([]);
  const scrollDepths = useRef<{ [page: string]: number }>({});
  const elementVisibility = useRef<Set<string>>(new Set());
  const lastActivity = useRef(Date.now());
  const isIdle = useRef(false);
  const focusedInputs = useRef<{ [field: string]: { focusTime: number; value: string } }>({});

  useEffect(() => {
    // 🔴 CLICK TRACKING (including rage clicks and dead clicks)
    const handleClick = (e: MouseEvent) => {
      lastActivity.current = Date.now();
      isIdle.current = false;

      const target = e.target as HTMLElement;
      const elementSelector = getElementSelector(target);
      const clickData: ClickData = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        element: elementSelector,
        count: 1,
      };

      // Check for rage clicks (3+ clicks in same area within 1 second)
      const recentSimilarClicks = recentClicks.current.filter(
        (click) =>
          Math.abs(click.x - clickData.x) < 50 &&
          Math.abs(click.y - clickData.y) < 50 &&
          Date.now() - click.timestamp < 1000
      );

      if (recentSimilarClicks.length >= 2) {
        // RAGE CLICK DETECTED
        trackEvent('custom', {
          eventName: 'rage_click',
          x: clickData.x,
          y: clickData.y,
          element: elementSelector,
          clickCount: recentSimilarClicks.length + 1,
          page: window.location.pathname,
        });
      }

      // Check for dead clicks (clicking on non-interactive elements)
      const isInteractive = target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.hasAttribute('onclick') ||
        target.style.cursor === 'pointer';

      if (!isInteractive) {
        trackEvent('custom', {
          eventName: 'dead_click',
          x: clickData.x,
          y: clickData.y,
          element: elementSelector,
          page: window.location.pathname,
        });
      }

      // Track all clicks for heatmap
      trackEvent('custom', {
        eventName: 'click',
        x: clickData.x,
        y: clickData.y,
        element: elementSelector,
        page: window.location.pathname,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });

      recentClicks.current.push(clickData);

      // Keep only last 10 clicks
      if (recentClicks.current.length > 10) {
        recentClicks.current.shift();
      }
    };

    // 🔴 MOUSE MOVEMENT TRACKING (for heatmaps)
    let mouseMoveThrottle: NodeJS.Timeout | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveThrottle) return;

      mouseMoveThrottle = setTimeout(() => {
        mouseMoveThrottle = null;
      }, 100); // Throttle to every 100ms

      mousePositions.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep only last 100 positions to avoid memory bloat
      if (mousePositions.current.length > 100) {
        mousePositions.current.shift();
      }

      lastActivity.current = Date.now();
      isIdle.current = false;
    };

    // 🔴 SCROLL TRACKING (scroll depth per page)
    let scrollThrottle: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollThrottle) return;

      scrollThrottle = setTimeout(() => {
        scrollThrottle = null;
      }, 200);

      const page = window.location.pathname;
      const scrollDepth = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );

      const previousDepth = scrollDepths.current[page] || 0;

      if (scrollDepth > previousDepth) {
        scrollDepths.current[page] = scrollDepth;

        // Track milestone scrolls
        if (
          (scrollDepth >= 25 && previousDepth < 25) ||
          (scrollDepth >= 50 && previousDepth < 50) ||
          (scrollDepth >= 75 && previousDepth < 75) ||
          (scrollDepth >= 100 && previousDepth < 100)
        ) {
          trackEvent('custom', {
            eventName: 'scroll_depth',
            depth: scrollDepth,
            page,
          });
        }
      }

      lastActivity.current = Date.now();
      isIdle.current = false;
    };

    // 🔴 HOVER TRACKING (what elements users are interested in)
    let hoverThrottle: NodeJS.Timeout | null = null;
    const handleMouseEnter = (e: MouseEvent) => {
      if (hoverThrottle) return;

      hoverThrottle = setTimeout(() => {
        hoverThrottle = null;
      }, 500);

      const target = e.target as HTMLElement;
      const elementSelector = getElementSelector(target);

      trackEvent('custom', {
        eventName: 'hover',
        element: elementSelector,
        page: window.location.pathname,
      });
    };

    // 🔴 COPY/PASTE TRACKING
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() || '';
      if (selection) {
        trackEvent('custom', {
          eventName: 'copy',
          textLength: selection.length,
          page: window.location.pathname,
        });
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      trackEvent('custom', {
        eventName: 'paste',
        page: window.location.pathname,
        target: getElementSelector(e.target as HTMLElement),
      });
    };

    // 🔴 TAB VISIBILITY (when user leaves/returns to tab)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('custom', {
          eventName: 'tab_hidden',
          page: window.location.pathname,
          timeOnPage: Date.now() - lastActivity.current,
        });
      } else {
        trackEvent('custom', {
          eventName: 'tab_visible',
          page: window.location.pathname,
        });
        lastActivity.current = Date.now();
        isIdle.current = false;
      }
    };

    // 🔴 IDLE DETECTION (user inactive for 30+ seconds)
    const idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivity.current;
      const idleThreshold = 30000; // 30 seconds

      if (idleTime > idleThreshold && !isIdle.current) {
        isIdle.current = true;
        trackEvent('custom', {
          eventName: 'user_idle',
          idleTime: Math.floor(idleTime / 1000),
          page: window.location.pathname,
        });
      }
    }, 10000); // Check every 10 seconds

    // 🔴 FORM INTERACTION TRACKING
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const fieldName = (target as HTMLInputElement).name || (target as HTMLInputElement).id || 'unknown';
        focusedInputs.current[fieldName] = {
          focusTime: Date.now(),
          value: (target as HTMLInputElement).value || '',
        };

        trackEvent('custom', {
          eventName: 'form_field_focus',
          fieldName,
          fieldType: (target as HTMLInputElement).type || target.tagName.toLowerCase(),
          page: window.location.pathname,
        });
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const fieldName = (target as HTMLInputElement).name || (target as HTMLInputElement).id || 'unknown';
        const focusData = focusedInputs.current[fieldName];

        if (focusData) {
          const timeSpent = Math.floor((Date.now() - focusData.focusTime) / 1000);
          const currentValue = (target as HTMLInputElement).value || '';
          const wasAbandoned = currentValue === focusData.value && currentValue === '';

          trackEvent('custom', {
            eventName: 'form_field_blur',
            fieldName,
            fieldType: (target as HTMLInputElement).type || target.tagName.toLowerCase(),
            timeSpent,
            wasAbandoned,
            hadValue: currentValue.length > 0,
            page: window.location.pathname,
          });

          delete focusedInputs.current[fieldName];
        }
      }
    };

    // 🔴 ELEMENT VISIBILITY TRACKING (IntersectionObserver)
    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const elementSelector = getElementSelector(entry.target as HTMLElement);

            if (entry.isIntersecting && !elementVisibility.current.has(elementSelector)) {
              elementVisibility.current.add(elementSelector);

              trackEvent('custom', {
                eventName: 'element_visible',
                element: elementSelector,
                page: window.location.pathname,
              });
            }
          });
        },
        { threshold: 0.5 } // Element is 50% visible
      );

      // Observe all images, buttons, and headings
      document.querySelectorAll('img, button, h1, h2, h3, [data-track-view]').forEach((el) => {
        observer.observe(el);
      });

      return observer;
    };

    const visibilityObserver = observeElements();

    // 🔴 ERROR TRACKING
    const handleError = (e: ErrorEvent) => {
      trackEvent('custom', {
        eventName: 'javascript_error',
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno,
        page: window.location.pathname,
      });
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      trackEvent('custom', {
        eventName: 'promise_rejection',
        reason: String(e.reason),
        page: window.location.pathname,
      });
    };

    // Attach all listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Send mouse heatmap data every 30 seconds
    const heatmapInterval = setInterval(() => {
      if (mousePositions.current.length > 0) {
        trackEvent('custom', {
          eventName: 'mouse_heatmap_batch',
          positions: mousePositions.current.slice(), // Send copy
          page: window.location.pathname,
          sessionDuration: Date.now() - lastActivity.current,
        });
        mousePositions.current = []; // Clear after sending
      }
    }, 30000);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(idleCheckInterval);
      clearInterval(heatmapInterval);
      visibilityObserver.disconnect();
    };
  }, [trackEvent]);

  return null;
}

// Helper: Get CSS selector for an element
function getElementSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c).join('.');
    return `${element.tagName.toLowerCase()}.${classes}`;
  }
  return element.tagName.toLowerCase();
}
