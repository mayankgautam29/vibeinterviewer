import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ParallaxClient from "@/components/ParallaxClient";
import Navbar from "./Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeInterviewer - AI Interview Platform",
  description: "Ace your interviews with real-time AI feedback at VibeInterviewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dim">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-black`}
        >
          <ParallaxClient />
          <Navbar />
          <main className="relative min-h-[calc(100vh-4rem)] pt-20 pb-12">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
