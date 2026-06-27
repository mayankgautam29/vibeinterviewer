"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (isSignedIn) {
    return (
      <button
        onClick={() => signOut()}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </Link>
  );
}
