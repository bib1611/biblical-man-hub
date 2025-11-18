'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AppId } from '@/types';
import Dock from '@/components/dock/Dock';
import Window from '@/components/shared/Window';
import ContentFeed from '@/components/windows/ContentFeed';
import BibleStudy from '@/components/windows/BibleStudy';
import SalesBeastAI from '@/components/windows/SalesBeastAI';
import ProductsHub from '@/components/windows/ProductsHub';
import RadioPlayer from '@/components/windows/RadioPlayer';
import CounselingChat from '@/components/windows/CounselingChat';
import ContactForm from '@/components/windows/ContactForm';

export default function Home() {
  const { windows } = useAppStore();

  useEffect(() => {
    // Listen for custom events to open windows
    const handleOpenWindow = (e: CustomEvent) => {
      const windowId = e.detail as AppId;
      if (useAppStore.getState().windows[windowId]) {
        useAppStore.getState().openWindow(windowId);
      }
    };

    window.addEventListener('open-window' as any, handleOpenWindow as EventListener);

    return () => {
      window.removeEventListener('open-window' as any, handleOpenWindow as EventListener);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-black via-red-950/10 to-black">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content Area */}
      <div className="relative w-full h-full">
        {/* Sidebar Dock */}
        <Dock />

        {/* Window Container */}
        <div className="absolute left-20 top-0 right-0 bottom-0">
          {/* Content Feed Window */}
          {windows['content-feed'].isOpen && (
            <Window id="content-feed">
              <ContentFeed />
            </Window>
          )}

          {/* Bible Study Window */}
          {windows['bible-study'].isOpen && (
            <Window id="bible-study">
              <BibleStudy />
            </Window>
          )}

          {/* Sales Beast AI Window */}
          {windows['sales-beast'].isOpen && (
            <Window id="sales-beast">
              <SalesBeastAI />
            </Window>
          )}

          {/* Products Hub Window */}
          {windows['products'].isOpen && (
            <Window id="products">
              <ProductsHub />
            </Window>
          )}

          {/* Radio Player Window */}
          {windows['radio'].isOpen && (
            <Window id="radio">
              <RadioPlayer />
            </Window>
          )}

          {/* Counseling Chat Window */}
          {windows['counseling'].isOpen && (
            <Window id="counseling">
              <CounselingChat />
            </Window>
          )}

          {/* Contact Form Window */}
          {windows['contact'].isOpen && (
            <Window id="contact">
              <ContactForm />
            </Window>
          )}
        </div>

        {/* Welcome Message (shown when no windows are open) */}
        {Object.values(windows).every((w) => !w.isOpen) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-2xl px-8">
              <div className="mb-6 inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/50">
                  <span className="text-5xl font-bold text-white">†</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold text-red-100 mb-4 tracking-tight">
                The Biblical Man Hub
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Your command center for Biblical transformation.
              </p>
              <p className="text-sm text-gray-500">
                Click an icon on the left to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
