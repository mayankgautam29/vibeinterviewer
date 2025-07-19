"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="px-4 py-2 bg-white/10 text-white rounded-full opacity-50"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (isSignedIn) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/20"
      >
        Logout
      </button>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/20"
    >
      Login
    </Link>
  );
}
