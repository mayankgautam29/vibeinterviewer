"use client";

import Link from "next/link";
import AuthButton from "@/components/authbutton";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <Link href="/" className="text-white text-xl font-bold tracking-wide">
            VibeInterviewer
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/jobs" className="nav-link">Jobs</Link>
            <Link href="/jobnew" className="nav-link">Recruiters</Link>
            <Link href="/profile" className="nav-link">Profile</Link>
          </nav>

          <div className="hidden md:flex">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
