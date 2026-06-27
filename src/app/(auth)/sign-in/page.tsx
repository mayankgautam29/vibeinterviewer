"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/auth-layout";
import { GradientButton } from "@/components/ui/gradient-button";

export default function CustomSignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your interview journey"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="label-field">Email</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Password</label>
          <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-300">{error}</p>}
        <GradientButton type="submit" loading={loading} fullWidth>
          Sign In
        </GradientButton>
      </form>
    </AuthLayout>
  );
}
