"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Briefcase, Building2, User } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

export default function AllJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post("/api/alljobs");
        setJobs(res.data?.jobs ?? []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <PageShell>
      <PageHeader
        badge="Opportunities"
        title="Open Positions"
        subtitle="Browse roles and start your AI-powered interview in minutes."
      />

      {loading ? (
        <LoadingSpinner label="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Be the first to post a role or check back soon for new opportunities."
          actionLabel="Post a Job"
          actionHref="/jobnew"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: any) => (
            <Link href={`/jobs/${job._id}`} key={job._id} className="group block h-full">
              <GlassCard hover className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                    Apply
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
                  {job.jobtitle}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
                  {job.jobdescription}
                </p>
                {job.jobByUser && (
                  <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
                    {job.jobByUser.profileImg ? (
                      <img
                        src={job.jobByUser.profileImg}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )}
                    <span className="text-xs text-slate-500">Posted by {job.jobByUser.username}</span>
                  </div>
                )}
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
