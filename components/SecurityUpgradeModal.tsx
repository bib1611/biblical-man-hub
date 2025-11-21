import React, { useState } from 'react';
import { Shield, Lock, Crown, AlertTriangle } from 'lucide-react';
import { useSession } from '@/lib/contexts/SessionContext';

interface SecurityUpgradeModalProps {
    appName: string; // 'Radio' or 'Bible'
}

export default function SecurityUpgradeModal({ appName }: SecurityUpgradeModalProps) {
    const { login } = useSession();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        const success = await login(email);
        if (success) {
            setStatus('success');
            // The parent component will react to the user state change and remove the modal
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-red-900/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-950 to-black p-6 border-b border-red-900/30 flex items-center gap-4">
                    <div className="p-3 bg-red-900/20 rounded-full border border-red-500/30 animate-pulse">
                        <Shield size={32} className="text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Security Protocol Active</h2>
                        <p className="text-xs text-red-400 font-mono uppercase tracking-wider">
                            Access Limit Reached
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-gray-300 leading-relaxed">
                            To protect the integrity of the {appName} from malicious attacks and data corruption, we limit anonymous access to 5 minutes.
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm text-center">
                        Verify your identity to unlock unlimited, secure access to the Hub.
                    </p>

                    {isLoggingIn ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-xs text-red-500">Email not found. Please purchase access first.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Verifying...' : 'Unlock Access'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsLoggingIn(false)}
                                className="w-full text-xs text-gray-500 hover:text-gray-300"
                            >
                                Cancel Login
                            </button>
                            <p className="text-[10px] text-center text-gray-600 mt-2">
                                Problems signing in? Email <a href="mailto:biblicalmancustomers1611@yahoo.com" className="text-red-500 hover:underline">biblicalmancustomers1611@yahoo.com</a>
                            </p>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <a
                                href="https://buy.stripe.com/3cIdRa2kM8WJgmIabYcMM1T"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-center rounded-lg shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Crown size={20} />
                                    <span>Secure Your Access ($3)</span>
                                </div>
                            </a>

                            <button
                                onClick={() => setIsLoggingIn(true)}
                                className="block w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-medium rounded-lg transition-colors text-sm"
                            >
                                Already a member? Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-black p-4 text-center border-t border-gray-900">
                    <p className="text-[10px] text-gray-600">
                        Secure Connection • 256-bit Encryption • Member Protected
                    </p>
                </div>
            </div>
        </div>
    );
}
