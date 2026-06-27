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
      setError(err.errors?.[0]?.longMessage || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your account to apply and manage interviews."
      footer={
        <>
          No account?{" "}
          <Link href="/sign-up" className="text-zinc-300 underline underline-offset-4 hover:text-white">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="label-field">Email</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label className="label-field">Password</label>
          <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <GradientButton type="submit" loading={loading} fullWidth>
          Sign in
        </GradientButton>
      </form>
    </AuthLayout>
  );
}
