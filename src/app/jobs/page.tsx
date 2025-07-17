"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
export default function AllJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.post("/api/alljobs");
      setJobs(res.data.jobs);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {jobs.map((job: any) => (
        <Link href={`/jobs/${job._id}`} key={job._id}>
          <div
            key={job._id}
            className="border p-4 rounded dark:bg-zinc-800 shadow"
          >
            <h2 className="text-xl font-bold">{job.jobtitle}</h2>
            <p className="text-gray-600">{job.company}</p>
            <p className="mt-2">{job.jobdescription}</p>

            {job.jobByUser && (
              <div className="mt-2 text-sm text-gray-500">
                Posted by: {job.jobByUser.username}
                <img
                  src={job.jobByUser.profileImg}
                  alt="Profile"
                  className="inline-block w-6 h-6 rounded-full ml-2"
                />
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
