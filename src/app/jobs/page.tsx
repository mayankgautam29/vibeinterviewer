"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Briefcase, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
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
        <ul className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/30">
          {jobs.map((job: any) => (
            <li key={job._id}>
              <Link
                href={`/jobs/${job._id}`}
                className="group flex flex-col gap-2 px-5 py-5 transition-colors hover:bg-sky-500/[0.04] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-100 group-hover:text-sky-200 transition-colors">
                    {job.jobtitle}
                  </p>
                  <p className="mt-0.5 text-sm text-teal-500/80">{job.company}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {job.jobdescription}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500 group-hover:text-sky-400">
                  {job.jobByUser?.username && <span>{job.jobByUser.username}</span>}
                  <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
