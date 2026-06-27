"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .post("/api/profile")
      .then((res) => setUser(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading profile…" />;
  if (!user) return <LoadingSpinner label="Could not load profile" />;

  const hasResume = Boolean(user.resume);

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader badge="Account" title="Profile" centered={false} />

      <div className="flex items-start gap-5 border-b border-slate-800/80 pb-8">
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full border border-slate-700/60 object-cover ring-2 ring-sky-500/10"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl font-medium text-slate-400">
            {user.username?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{user.username}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-8">
        <div className="surface rounded-lg px-4 py-4">
          <p className="text-xs text-slate-600">Resume</p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {hasResume ? "Uploaded" : "Not uploaded"}
          </p>
        </div>
        <div className="surface rounded-lg px-4 py-4">
          <p className="text-xs text-slate-600">Interview ready</p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {hasResume ? "Yes" : "Upload resume first"}
          </p>
        </div>
      </div>

      <GlassCard>
        <p className="text-sm text-slate-500">
          {hasResume
            ? "Your resume is indexed. Browse open roles and start an interview when you apply."
            : "Upload a resume before applying to any role. We use it to tailor interview questions."}
        </p>
        <div className="mt-5">
          {!hasResume ? (
            <GradientButton onClick={() => router.push("/resume")} fullWidth>
              Upload resume
            </GradientButton>
          ) : (
            <GradientButton href="/jobs" variant="secondary" fullWidth>
              Browse jobs
            </GradientButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
