'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(password);
    if (success) {
      // Successfully logged in
      setPassword('');
    } else {
      setError('Invalid password. Access denied.');
      setPassword('');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-red-950/30 text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8"
      >
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50">
            <Shield size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-100 mb-2">Admin Access</h1>
          <p className="text-sm text-gray-400">
            Secured area - Authentication required
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-2 focus:ring-red-600/20 transition-all"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg text-red-200 text-sm flex items-center gap-2"
            >
              <Lock size={16} />
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg shadow-red-900/50 transition-all transform hover:scale-105 active:scale-95"
          >
            Unlock Admin Dashboard
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-black/40 border border-gray-800/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">Security Notice</p>
              <p>
                This area contains sensitive analytics and lead information.
                Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
