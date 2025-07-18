"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <Link href="/" className="text-white text-xl font-bold tracking-wide">
            VibeInterviewer
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/jobs" className="nav-link">
              Jobs
            </Link>
            <Link href="/jobnew" className="nav-link">
              Recruiters
            </Link>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>
          </nav>

          <div className="hidden md:flex">
            {isSignedIn ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/20"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
