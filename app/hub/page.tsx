'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BibleStudy from '@/components/windows/BibleStudy';
import RadioPlayer from '@/components/windows/RadioPlayer';
import SamAssistant from '@/components/windows/SamAssistant';
import ProductsHub from '@/components/windows/ProductsHub';
import SubstackArticles from '@/components/windows/SubstackArticles';
import CommunityChat from '@/components/windows/CommunityChat';
import ContactForm from '@/components/windows/ContactForm';
import ProtectedAdminDashboard from '@/components/windows/ProtectedAdminDashboard';
import About from '@/components/windows/About';
import StartHere from '@/components/windows/StartHere';
import ContentFeed from '@/components/windows/ContentFeed';
import { SessionProvider } from '@/lib/contexts/SessionContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import GlobalAudioProvider from '@/components/GlobalAudioProvider';

export default function HubPage() {
    const searchParams = useSearchParams();
    const [activeApp, setActiveApp] = useState<string>('bible');

    useEffect(() => {
        // Get app from URL params
        const appParam = searchParams.get('app');
        if (appParam) {
            setActiveApp(appParam);
        }
    }, [searchParams]);

    return (
        <SessionProvider>
            <AuthProvider>
                <GlobalAudioProvider />
                <DashboardLayout activeApp={activeApp} onAppChange={setActiveApp}>
                    {activeApp === 'bible' && <BibleStudy />}
                    {activeApp === 'radio' && <RadioPlayer />}
                    {activeApp === 'sam' && <SamAssistant />}
                    {activeApp === 'admin' && <ProtectedAdminDashboard />}
                    {activeApp === 'products' && <ProductsHub />}
                    {activeApp === 'content-feed' && <ContentFeed />}
                    {activeApp === 'counseling' && <SubstackArticles />}
                    {activeApp === 'community' && <CommunityChat />}
                    {activeApp === 'about' && <About />}
                    {activeApp === 'start-here' && <StartHere />}
                    {activeApp === 'contact' && <ContactForm />}
                </DashboardLayout>
            </AuthProvider>
        </SessionProvider>
    );
}
