'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Radio,
    MessageSquare,
    ShieldAlert,
    Settings,
    Menu,
    X,
    Home,
    LogOut,
    FileText
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import MiniPlayer from '@/components/MiniPlayer';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeApp: string;
    onAppChange: (appId: string) => void;
}

const navItems = [
    { id: 'radio', label: 'Radio', icon: Radio, isLive: true, featured: true },
    { id: 'counseling', label: 'Articles', icon: FileText, featured: true },
    { id: 'bible', label: 'Bible', icon: BookOpen },
    { id: 'sam', label: 'Ask Sam', icon: MessageSquare },
    { id: 'admin', label: 'Admin', icon: ShieldAlert },
];

export default function DashboardLayout({ children, activeApp, onAppChange }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;


    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-black">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-tighter">THE HUB</h1>
                    <p className="text-xs text-gray-500">Biblical Man</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeApp === item.id;
                        const isFeatured = 'featured' in item && item.featured;
                        const isLive = 'isLive' in item && item.isLive;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onAppChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                                    isActive
                                        ? 'bg-white text-black font-medium'
                                        : isFeatured
                                        ? 'text-white hover:bg-white/10 font-medium border border-white/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {isLive && !isActive && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Mini Player for Desktop */}
                {activeApp !== 'radio' && (
                    <div className="border-t border-white/10 pt-4">
                        <MiniPlayer onExpand={() => onAppChange('radio')} />
                    </div>
                )}

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black z-20">
                    <h1 className="text-lg font-bold">THE HUB</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto relative bg-black">
                    {children}
                </main>

                {/* Mini Player for Mobile */}
                {activeApp !== 'radio' && (
                    <div className="md:hidden border-t border-white/10 bg-black">
                        <MiniPlayer onExpand={() => onAppChange('radio')} />
                    </div>
                )}

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden flex items-center justify-around p-2 border-t border-white/10 bg-black pb-safe">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeApp === item.id;
                        const isFeatured = 'featured' in item && item.featured;
                        const isLive = 'isLive' in item && item.isLive;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onAppChange(item.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
                                    isActive
                                        ? 'text-white'
                                        : isFeatured
                                        ? 'text-white'
                                        : 'text-gray-500'
                                }`}
                            >
                                <div className="relative">
                                    <Icon size={24} className={isActive ? 'fill-current' : ''} />
                                    {isLive && !isActive && (
                                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] mt-1 ${isFeatured ? 'font-bold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
