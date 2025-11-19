'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to analytics
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Track error with analytics if available
    if (typeof window !== 'undefined' && (window as any).trackEvent) {
      (window as any).trackEvent('error', {
        eventName: 'error_boundary_triggered',
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback - INVISIBLE so site still works
      return null;
    }

    return this.props.children;
  }
}

/**
 * Invisible error boundary that swallows errors without showing UI
 * Use this for non-critical components like analytics, popups, etc.
 */
export function SilentErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary fallback={null}>{children}</ErrorBoundary>;
}
