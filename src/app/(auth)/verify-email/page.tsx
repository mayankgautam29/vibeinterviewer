"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/ui/auth-layout";
import { GradientButton } from "@/components/ui/gradient-button";

export default function VerifyEmailPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otpCode });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await fetch("/api/createuser");
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox">
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="label-field">Verification code</label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="123456"
            className="input-field text-center text-2xl tracking-[0.5em] font-mono"
            required
          />
        </div>
        {error && <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-300">{error}</p>}
        <GradientButton type="submit" loading={loading} fullWidth>
          Verify Email
        </GradientButton>
        <p className="text-center text-xs text-slate-500">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </form>
    </AuthLayout>
  );
}
