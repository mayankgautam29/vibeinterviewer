"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/auth-layout";
import { GradientButton } from "@/components/ui/gradient-button";

export default function CustomSignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signUp.create({ emailAddress: email, password, username });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await axios.get("/api/createuser");
        router.push("/");
      } else {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        router.push("/verify-email");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start applying to roles and completing AI interviews."
      footer={
        <>
          Already registered?{" "}
          <Link href="/sign-in" className="text-zinc-300 underline underline-offset-4 hover:text-white">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="label-field">Username</label>
          <input type="text" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Password</label>
          <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div id="clerk-captcha" className="hidden" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <GradientButton type="submit" loading={loading} fullWidth>
          Create account
        </GradientButton>
      </form>
    </AuthLayout>
  );
}
