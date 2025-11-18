'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Activity } from 'lucide-react';

export default function ProtectedAdminDashboard() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-100">
        <div className="text-center">
          <Activity className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="h-full relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-900/40 hover:bg-red-800/60 border border-red-600/30 rounded-lg text-sm font-semibold text-red-200 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Dashboard */}
      <AdminDashboard />
    </div>
  );
}
