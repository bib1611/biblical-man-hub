import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BehavioralTracker } from "@/components/BehavioralTracker";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SilentErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Biblical Man Hub - Command Center for Biblical Transformation",
  description: "Your complete hub for Biblical content, KJV Bible study, products, counseling, and more. Built for men who lead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SilentErrorBoundary>
          <BehavioralTracker />
        </SilentErrorBoundary>
        {children}
        <SilentErrorBoundary>
          <ExitIntentPopup />
        </SilentErrorBoundary>
      </body>
    </html>
  );
}
