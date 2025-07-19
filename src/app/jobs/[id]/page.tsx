"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type JobType = {
  _id: string;
  jobtitle: string;
  company: string;
  jobdescription: string;
  jobByUser?: {
    username: string;
    profileImg: string;
  };
  applicants?: any[];
};

type User = {
  _id: string;
  userId: string;
  username: string;
  email: string;
  profileImg: string;
  resume: string;
};

type Interview = {
  _id: string;
  userId: string;
  jobId: string;
  interviewSummary: string;
  interviewScore: number;
  status: string;
};

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;
  const { userId, isLoaded } = useAuth();

  const [job, setJob] = useState<JobType | null>(null);
  const [interviewed, setInterviewed] = useState(false);
  const [owner, setOwner] = useState(false);
  const [usr, setUsr] = useState<User | null>(null);
  const [interviewModel, setInterviewModel] = useState<Interview | null>(null);
  const [userInterview, setUserInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const jobRes = await axios.post("/api/getjobbyid", { jobId });
      setJob(jobRes.data.job);

      if (isLoaded && userId) {
        const ownerRes = await axios.post("/api/getowner", { jobId });
        const isOwner = ownerRes.data.owner;
        setOwner(isOwner);

        if (isOwner) {
          const interviewRes = await axios.post("/api/getinterviewresults", { jobId });
          setUsr(interviewRes.data.user);
          setInterviewModel(interviewRes.data.interview);
        } else {
          const appliedRes = await axios.post("/api/jobapplied", { jobId, userId });
          if (appliedRes.data.message === null) {
            setInterviewed(false);
          } else {
            setUserInterview(appliedRes.data.message);
            setInterviewed(true);
          }

          const userRes = await axios.post("/api/getuserbyid", { userId });
          setUsr(userRes.data.user);
        }
      }
    };

    fetchData();
  }, [isLoaded, userId, jobId]);

  const handleStatusChange = async (status: "accepted" | "rejected") => {
    if (!interviewModel?._id) return;
    try {
      const res = await axios.post("/api/interviewstatus", {
        interviewId: interviewModel._id,
        status,
      });
      if (res.data.success) {
        setInterviewModel((prev) => prev ? { ...prev, status } : prev);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleApplyClick = () => {
    if (!usr?.resume) {
      router.push("/resume");
    } else {
      router.push(`/jobs/${job?._id}/interview`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-2">
      <div className="max-w-2xl w-full p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.2)] border border-cyan-400 animate-fade-in transition-all duration-700 ease-out">
        <h1 className="text-3xl font-extrabold text-cyan-400 mb-2">{job?.jobtitle}</h1>
        <p className="text-gray-300 mb-2">{job?.company}</p>
        <p className="text-gray-400 mb-6">{job?.jobdescription}</p>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-300">Posted by:</span>
          <img
            src={job?.jobByUser?.profileImg}
            alt="user"
            className="w-8 h-8 rounded-full border border-cyan-500 shadow"
          />
          <span className="text-white">{job?.jobByUser?.username}</span>
        </div>

        {owner && interviewModel && (
          <>
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">📄 Candidate Review</h2>
            <div className="bg-[#111827] p-4 rounded-xl border border-cyan-600 shadow-md space-y-3">
              <div className="text-white">User: <span className="font-semibold">{usr?.username}</span></div>
              <div className="text-white">Score: {interviewModel?.interviewScore}</div>
              <div className="text-white">Status: {interviewModel?.status}</div>
              <div className="text-white whitespace-pre-wrap">
                <span className="font-medium">Interview Summary:</span><br />
                {interviewModel?.interviewSummary || "No summary available."}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleStatusChange("accepted")}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleStatusChange("rejected")}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </>
        )}

        {!owner && interviewed && (
          <div className="text-yellow-400 font-medium mt-4">Status: {userInterview?.status}</div>
        )}

        {!owner && (
          interviewed ? (
            <div className="text-green-500 mt-4 font-semibold">✅ You have already applied</div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition-transform duration-300 shadow-md"
            >
              🚀 Apply Now
            </button>
          )
        )}

        {/* {job?.applicants && (
          <div className="mt-6 text-cyan-400 text-sm font-medium tracking-wide border-t border-cyan-700 pt-3">
            Applicants Count: {job.applicants.length}
          </div>
        )} */}
      </div>
    </div>
  );
}
