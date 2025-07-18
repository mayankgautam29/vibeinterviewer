"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="p-4 mt-10">
      <h1 className="text-2xl font-bold">{job?.jobtitle}</h1>
      <p className="text-gray-600">{job?.company}</p>
      <p className="mt-2">{job?.jobdescription}</p>

      <div className="mt-4">
        Posted by: {job?.jobByUser?.username}
        <img
          src={job?.jobByUser?.profileImg}
          className="w-6 h-6 rounded-full inline-block ml-2"
        />

        {owner && (
          <>
            <div className="mt-2">User: {usr?.username}</div>
            <div>Score: {interviewModel?.interviewScore}</div>
            <div>Status: {interviewModel?.status}</div>

            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => handleStatusChange("accepted")}
              >
                Accept
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleStatusChange("rejected")}
              >
                Reject
              </button>
            </div>
          </>
        )}

        {!owner && interviewed && (
          <div>Status: {userInterview?.status}</div>
        )}
      </div>

      {!owner && (
        interviewed ? (
          <div className="mt-2 text-green-600">You have already applied</div>
        ) : (
          <button
            onClick={handleApplyClick}
            className="text-blue-600 underline mt-2 block"
          >
            Apply Here
          </button>
        )
      )}

      {job?.applicants && (
        <div className="mt-2 text-sm text-blue-500">
          Applicants: {job.applicants.length}
        </div>
      )}
    </div>
  );
}
