import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "VibeInterviewer — AI Interview Platform",
  description: "Structured AI interviews for candidates and hiring teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
