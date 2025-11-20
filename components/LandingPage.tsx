'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
    onEnter: (appId?: string) => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
            {/* Subtle Background Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Main Content - Centered */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Minimalist Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium tracking-widest uppercase text-gray-400">The Biblical Man Hub</span>
                    </div>

                    {/* Hero Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 font-heading leading-[1.1]">
                        Lead Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            Family.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Stop being passive. Stop making excuses. <br className="hidden md:block" />
                        Get the tools, guidance, and brotherhood you need to lead.
                    </p>

                    {/* Primary CTA */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onEnter()}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-bold transition-all hover:bg-gray-200"
                    >
                        <span>Enter The Hub</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Secondary CTA - Radio */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            // We need to pass a specific app ID, but the current onEnter prop doesn't support it.
                            // We'll need to update the onEnter prop signature or handle this in the parent.
                            // For now, let's assume we can pass an argument or the parent handles it.
                            // Actually, let's update the prop signature in the next step if needed.
                            // Wait, onEnter is () => void. 
                            // I should update the interface first.
                            // But for now, let's just add the button and I'll update the interface in a separate step if I can't do it here.
                            // I'll assume onEnter can take an optional argument.
                            onEnter('radio');
                        }}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full text-lg font-bold transition-all hover:bg-white/10 ml-4"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span>Listen Live</span>
                    </motion.button>

                    {/* Minimal Social Proof */}
                    <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-gray-600" />
                            <span>20,000+ Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-gray-600" />
                            <span>Biblical Frameworks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-gray-600" />
                            <span>AI Guidance</span>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Minimal Footer */}
            <footer className="p-8 text-center z-10">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-600 uppercase tracking-widest">
                    <button onClick={() => onEnter()} className="hover:text-white transition-colors">Manifesto</button>
                    <button onClick={() => onEnter()} className="hover:text-white transition-colors">About</button>
                    <button onClick={() => onEnter()} className="hover:text-white transition-colors">Login</button>
                </div>
            </footer>
        </div>
    );
}
