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
    <AuthLayout title="Verify email" subtitle="Enter the code sent to your inbox.">
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="label-field">Verification code</label>
          <input
            type="text"
            inputMode="numeric"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="input-field text-center font-mono tracking-widest"
            placeholder="000000"
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <GradientButton type="submit" loading={loading} fullWidth>
          Verify
        </GradientButton>
      </form>
    </AuthLayout>
  );
}
