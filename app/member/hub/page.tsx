'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AppMode = 'bible' | 'radio' | 'counseling' | 'products' | null;

export default function MemberHubPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentApp, setCurrentApp] = useState<AppMode>(null);
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/member/check-auth');
      if (!response.ok) {
        router.push('/member/login');
        return;
      }
      const data = await response.json();
      setMemberEmail(data.email);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/member/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/member/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your hub...</p>
        </div>
      </div>
    );
  }

  // Route to main app with session
  useEffect(() => {
    if (currentApp) {
      // Redirect to dedicated hub route
      const targetUrl = '/hub?app=' + currentApp;
      console.log('🔄 Redirecting to:', targetUrl);
      window.location.href = targetUrl;
    }
  }, [currentApp]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Member Hub</h1>
            <p className="text-gray-400">Welcome back, {memberEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* App Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* War Room */}
          <button
            onClick={() => setCurrentApp('bible')}
            className="group bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 transition-all text-left"
          >
            <div className="text-4xl mb-4">⚔️</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
              The War Room
            </h2>
            <p className="text-gray-400">
              Deep KJV Bible study tools to sharpen your sword.
            </p>
          </button>

          {/* King's Radio */}
          <button
            onClick={() => setCurrentApp('radio')}
            className="group bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 transition-all text-left"
          >
            <div className="text-4xl mb-4">📻</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
              King's Radio
            </h2>
            <p className="text-gray-400">
              24/7 streaming of uncompromising biblical teaching.
            </p>
          </button>

          {/* Intel Articles */}
          <button
            onClick={() => setCurrentApp('counseling')}
            className="group bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 transition-all text-left"
          >
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
              Intel Articles
            </h2>
            <p className="text-gray-400">
              Tactical guides on marriage, fatherhood, and leadership.
            </p>
          </button>

          {/* The Armory */}
          <button
            onClick={() => setCurrentApp('products')}
            className="group bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 transition-all text-left"
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
              The Armory
            </h2>
            <p className="text-gray-400">
              Resources to equip you for the spiritual battle.
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>You have full access to all Biblical Man resources.</p>
        </div>
      </div>
    </div>
  );
}
