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
    return <div className="h-8 w-20 animate-pulse rounded-md bg-zinc-800" />;
  }

  if (isSignedIn) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-md border border-zinc-700 px-3.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
      >
        Sign out
      </button>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="rounded-md bg-zinc-100 px-3.5 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
    >
      Sign in
    </Link>
  );
}
