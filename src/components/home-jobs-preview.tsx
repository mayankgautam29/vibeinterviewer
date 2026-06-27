"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type Job = {
  _id: string;
  jobtitle: string;
  company: string;
  jobdescription: string;
};

export function HomeJobsPreview() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("/api/alljobs")
      .then((res) => setJobs((res.data?.jobs ?? []).slice(0, 4)))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner label="Loading openings…" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="surface rounded-xl px-5 py-8 text-sm text-slate-500">
        No roles posted yet.{" "}
        <Link href="/jobnew" className="text-sky-400 hover:underline">
          Post the first one
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/30">
      {jobs.map((job) => (
        <li key={job._id}>
          <Link
            href={`/jobs/${job._id}`}
            className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-sky-500/[0.04]"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-100 group-hover:text-sky-200">
                {job.jobtitle}
              </p>
              <p className="text-sm text-slate-500">{job.company}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-sky-400" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
