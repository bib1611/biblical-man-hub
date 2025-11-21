'use client';

import { motion } from 'framer-motion';
import { Radio, FileText, ArrowRight, Play } from 'lucide-react';

interface HubHeroProps {
    onNavigate: (appId: string) => void;
}

export default function HubHero({ onNavigate }: HubHeroProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl w-full"
            >
                {/* Welcome Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">The Hub</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Your daily source for biblical truth and guidance
                    </p>
                </div>

                {/* Featured Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Radio - FLAGSHIP */}
                    <motion.button
                        onClick={() => onNavigate('radio')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden bg-gradient-to-br from-red-900/40 via-red-800/20 to-transparent border border-red-500/30 hover:border-red-500/60 rounded-2xl p-8 text-left transition-all hover:shadow-2xl hover:shadow-red-900/30"
                    >
                        {/* Live Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600/80 backdrop-blur-sm rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
                        </div>

                        {/* Icon */}
                        <div className="mb-6 bg-red-600/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                            <Radio size={32} className="text-red-500" />
                        </div>

                        {/* Content */}
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                            The King's Radio
                        </h2>
                        <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
                            24/7 biblical teaching, worship music, and sermons from trusted voices. Listen live right now.
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-3 text-red-400 font-bold group-hover:gap-4 transition-all">
                            <Play size={20} fill="currentColor" />
                            <span>Start Listening</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>

                    {/* Articles - FLAGSHIP */}
                    <motion.button
                        onClick={() => onNavigate('counseling')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden bg-gradient-to-br from-zinc-800/40 via-zinc-700/20 to-transparent border border-white/20 hover:border-white/40 rounded-2xl p-8 text-left transition-all hover:shadow-2xl hover:shadow-white/10"
                    >
                        {/* Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Daily Posts</span>
                        </div>

                        {/* Icon */}
                        <div className="mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                            <FileText size={32} className="text-white" />
                        </div>

                        {/* Content */}
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                            Recent Articles
                        </h2>
                        <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
                            Daily biblical insights, guidance for men, and truth that cuts through the noise of culture.
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-3 text-white font-bold group-hover:gap-4 transition-all">
                            <FileText size={20} />
                            <span>Read Latest</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <button
                        onClick={() => onNavigate('bible')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                    >
                        Bible Study
                    </button>
                    <button
                        onClick={() => onNavigate('sam')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                    >
                        Ask Sam AI
                    </button>
                    <button
                        onClick={() => onNavigate('admin')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                    >
                        Admin Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
