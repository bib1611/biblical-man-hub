'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

export default function ChallengeForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 p-6 bg-black/30 border border-red-800/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-2">
                <Mail className="text-red-400" size={20} />
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="px-4 py-2 bg-black/50 border border-red-700 rounded text-white placeholder-gray-400 focus:outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50"
            >
                {status === 'sending' ? 'Sending...' : 'Get the 7‑Day Challenge'}
                <Send className="inline ml-1" size={16} />
            </button>
            {status === 'success' && (
                <motion.p className="text-green-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    🎉 Check your inbox!
                </motion.p>
            )}
            {status === 'error' && (
                <motion.p className="text-red-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ❌ Something went wrong.
                </motion.p>
            )}
        </motion.form>
    );
}
