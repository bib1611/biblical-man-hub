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
    { id: 'bible', label: 'Bible', icon: BookOpen },
    { id: 'radio', label: 'Radio', icon: Radio },
    { id: 'counseling', label: 'Articles', icon: FileText },
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

                        return (
                            <button
                                key={item.id}
                                onClick={() => onAppChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-white text-black font-medium'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
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

                        return (
                            <button
                                key={item.id}
                                onClick={() => onAppChange(item.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${isActive ? 'text-white' : 'text-gray-500'
                                    }`}
                            >
                                <Icon size={24} className={isActive ? 'fill-current' : ''} />
                                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
