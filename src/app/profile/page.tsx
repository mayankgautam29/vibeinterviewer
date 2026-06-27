"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Mail, User as UserIcon } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <PageShell narrow>
        <GlassCard className="space-y-4">
          <Skeleton className="mx-auto h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto h-6 w-40" />
          <Skeleton className="h-4 w-full" />
        </GlassCard>
      </PageShell>
    );
  }

  if (!user) return <LoadingSpinner label="Could not load profile" />;

  const hasResume = Boolean(user.resume);

  return (
    <PageShell narrow>
      <PageHeader badge="Account" title="Your Profile" subtitle="Manage your account and interview readiness." />

      <GlassCard className="text-center">
        <div className="relative mx-auto mb-6 h-28 w-28">
          {user.profileImg ? (
            <img
              src={user.profileImg}
              alt="Profile"
              className="h-full w-full rounded-full object-cover ring-4 ring-cyan-500/30 shadow-xl"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 ring-4 ring-white/10">
              <UserIcon className="h-12 w-12 text-slate-400" />
            </div>
          )}
          <span className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${hasResume ? "bg-emerald-400" : "bg-amber-400"}`} />
        </div>

        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
        <div className="mt-2 flex items-center justify-center gap-2 text-slate-400">
          <Mail className="h-4 w-4" />
          {user.email}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <FileText className="mx-auto h-6 w-6 text-violet-400 mb-2" />
            <p className="text-sm font-medium text-white">Resume</p>
            <p className="text-xs text-slate-500 mt-1">
              {hasResume ? "Uploaded & indexed" : "Not uploaded yet"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <UserIcon className="mx-auto h-6 w-6 text-cyan-400 mb-2" />
            <p className="text-sm font-medium text-white">Interview Ready</p>
            <p className="text-xs text-slate-500 mt-1">
              {hasResume ? "Ready to apply" : "Upload resume first"}
            </p>
          </div>
        </div>

        {!hasResume ? (
          <GradientButton variant="violet" className="mt-8" onClick={() => router.push("/resume")}>
            Upload Resume
          </GradientButton>
        ) : (
          <GradientButton href="/jobs" className="mt-8">
            Browse Jobs
          </GradientButton>
        )}
      </GlassCard>
    </PageShell>
  );
}
