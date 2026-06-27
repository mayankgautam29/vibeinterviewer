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
    <div className="mx-auto max-w-md">
      <PageHeader badge="Account" title="Profile" centered={false} />

      <GlassCard className="text-center">
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt=""
            className="mx-auto h-20 w-20 rounded-full border border-zinc-800 object-cover"
          />
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-xl font-medium text-zinc-400">
            {user.username?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <h2 className="mt-4 text-lg font-medium text-zinc-100">{user.username}</h2>
        <p className="mt-1 text-sm text-zinc-500">{user.email}</p>

        <div className="mt-6 border-t border-zinc-800 pt-6">
          <dl className="grid grid-cols-2 gap-4 text-left text-sm">
            <div>
              <dt className="text-zinc-600">Resume</dt>
              <dd className="mt-0.5 font-medium text-zinc-300">
                {hasResume ? "Uploaded" : "Missing"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-600">Can apply</dt>
              <dd className="mt-0.5 font-medium text-zinc-300">
                {hasResume ? "Yes" : "Upload resume first"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
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
