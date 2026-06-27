"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

export default function AllJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("/api/alljobs")
      .then((res) => setJobs(res.data?.jobs ?? []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        badge="Open roles"
        title="Jobs"
        subtitle="Select a role to view details and start your interview."
        centered={false}
      />

      {loading ? (
        <LoadingSpinner label="Loading jobs…" />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Check back later or post a role if you're hiring."
          actionLabel="Post a job"
          actionHref="/jobnew"
        />
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
          {jobs.map((job: any) => (
            <li key={job._id}>
              <Link
                href={`/jobs/${job._id}`}
                className="group flex flex-col gap-2 px-5 py-5 transition-colors hover:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100 group-hover:text-white">
                    {job.jobtitle}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-500">{job.company}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {job.jobdescription}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm text-zinc-500">
                  {job.jobByUser?.username && (
                    <span>Posted by {job.jobByUser.username}</span>
                  )}
                  <span className="text-zinc-400 group-hover:text-zinc-200">View →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
