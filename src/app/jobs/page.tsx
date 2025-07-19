"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AllJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post("/api/alljobs");
        const jobsList = res.data?.jobs ?? [];
        setJobs(jobsList);
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
    <div className="w-full py-12">
      <h1 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-10">
        All Jobs
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {jobs.length > 0 ? (
            jobs.map((job: any) => (
              <Link href={`/jobs/${job._id}`} key={job._id}>
                <Card
                  className={cn(
                    "group h-full w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/40 bg-[#0c1c2f] border border-[#1e293b]/50 backdrop-blur-sm shadow-md hover:shadow-blue-400/10"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                      {job.jobtitle}
                    </CardTitle>
                    <p className="text-sm text-slate-400">{job.company}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 line-clamp-3">{job.jobdescription}</p>
                    {job.jobByUser && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <User className="w-4 h-4 text-slate-500" />
                        {job.jobByUser.username}
                        {job.jobByUser.profileImg && (
                          <img
                            src={job.jobByUser.profileImg}
                            alt="Profile"
                            className="w-6 h-6 rounded-full object-cover ml-auto"
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-400">No jobs found.</div>
          )}
        </div>
      )}
    </div>
  );
}
