"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800" />;
  }

  if (isSignedIn) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-lg border border-slate-600/80 px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/80 hover:text-white"
      >
        Sign out
      </button>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-3.5 py-1.5 text-sm font-medium text-slate-950 shadow-md shadow-sky-500/20 transition hover:brightness-110"
    >
      Sign in
    </Link>
  );
}
