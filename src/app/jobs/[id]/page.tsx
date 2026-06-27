"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BackLink } from "@/components/ui/back-link";

type JobType = {
  _id: string;
  jobtitle: string;
  company: string;
  jobdescription: string;
  jobByUser?: { username: string; profileImg: string };
};

type User = {
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
  integrityNotes?: string;
  cheatingFlags?: string[];
  questionCount?: number;
  screenshots?: { data: string; timestamp: string; questionNumber: number }[];
};

const statusStyle: Record<string, string> = {
  pending: "text-amber-400/90",
  accepted: "text-emerald-400/90",
  rejected: "text-red-400/90",
};

export default function JobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;
  const { userId, isLoaded } = useAuth();

  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviewed, setInterviewed] = useState(false);
  const [owner, setOwner] = useState(false);
  const [usr, setUsr] = useState<User | null>(null);
  const [interviewModel, setInterviewModel] = useState<Interview | null>(null);
  const [userInterview, setUserInterview] = useState<Interview | null>(null);
  const [snapshots, setSnapshots] = useState<
    { data: string; timestamp: string; questionNumber: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await axios.post("/api/getjobbyid", { jobId });
        setJob(jobRes.data.job);
        if (isLoaded && userId) {
          const ownerRes = await axios.post("/api/getowner", { jobId });
          setOwner(ownerRes.data.owner);
          if (ownerRes.data.owner) {
            const interviewRes = await axios.post("/api/getinterviewresults", { jobId });
            setUsr(interviewRes.data.user);
            setInterviewModel(interviewRes.data.interview);
            if (interviewRes.data.interview?.userId) {
              const snapRes = await axios.get(
                `/api/upload-screenshot?jobId=${jobId}&userId=${interviewRes.data.interview.userId}`
              );
              const fromInterview = interviewRes.data.interview?.screenshots ?? [];
              const fromSnapshot = snapRes.data?.screenshots ?? [];
              setSnapshots(fromInterview.length > 0 ? fromInterview : fromSnapshot);
            }
          } else {
            const appliedRes = await axios.post("/api/jobapplied", { jobId, userId });
            setInterviewed(appliedRes.data.message !== null);
            setUserInterview(appliedRes.data.message);
            const userRes = await axios.post("/api/getuserbyid", { userId });
            setUsr(userRes.data.user);
          }
        }
      } finally {
        setLoading(false);
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
        setInterviewModel((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = () => {
    if (!usr?.resume) router.push("/resume");
    else router.push(`/jobs/${job?._id}/interview`);
  };

  if (loading) return <LoadingSpinner label="Loading…" />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/jobs">All jobs</BackLink>

      <header className="space-y-2 border-b border-slate-800/80 pb-8">
        <p className="text-sm font-medium text-teal-500/90">{job?.company}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          {job?.jobtitle}
        </h1>
        {job?.jobByUser && (
          <div className="flex items-center gap-2 pt-1 text-sm text-slate-500">
            {job.jobByUser.profileImg && (
              <img
                src={job.jobByUser.profileImg}
                alt=""
                className="h-6 w-6 rounded-full ring-1 ring-slate-700/60"
              />
            )}
            Posted by {job.jobByUser.username}
          </div>
        )}
      </header>

      <GlassCard>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
          {job?.jobdescription}
        </p>
        {!owner && !interviewed && (
          <div className="mt-6 border-t border-slate-800/80 pt-6">
            <GradientButton onClick={handleApplyClick}>Apply and start interview</GradientButton>
          </div>
        )}
      </GlassCard>

      {!owner && interviewed && (
        <GlassCard>
          <p className="text-sm text-slate-400">
            Application submitted ·{" "}
            <span className={statusStyle[userInterview?.status || "pending"]}>
              {userInterview?.status}
            </span>
          </p>
        </GlassCard>
      )}

      {owner && interviewModel && (
        <div className="space-y-6">
          <div>
            <p className="section-label mb-2">Candidate review</p>
            <h2 className="text-lg font-semibold text-slate-100">{usr?.username}</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Score", value: interviewModel.interviewScore },
              { label: "Questions", value: interviewModel.questionCount ?? "—" },
              { label: "Status", value: interviewModel.status },
            ].map(({ label, value }) => (
              <div key={label} className="surface rounded-lg px-3 py-4 text-center">
                <p className="text-lg font-semibold capitalize text-slate-100">{value}</p>
                <p className="mt-1 text-xs text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          {interviewModel.integrityNotes && (
            <GlassCard padding={false} className="border-amber-500/10 bg-amber-500/[0.03] p-4">
              <p className="text-xs font-medium text-amber-400/90">Integrity notes</p>
              <p className="mt-1 text-sm text-slate-400">{interviewModel.integrityNotes}</p>
            </GlassCard>
          )}

          {interviewModel.cheatingFlags && interviewModel.cheatingFlags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interviewModel.cheatingFlags.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-slate-700/60 bg-slate-900/50 px-2 py-1 text-xs text-slate-500"
                >
                  {f.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          <GlassCard>
            <p className="text-xs font-medium text-slate-500">Summary</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
              {interviewModel.interviewSummary || "No summary."}
            </p>
          </GlassCard>

          {snapshots.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-slate-400">
                Session snapshots ({snapshots.length})
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {snapshots.map((shot, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border border-slate-700/60 ring-1 ring-slate-800/50"
                  >
                    <img
                      src={`data:image/jpeg;base64,${shot.data}`}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-800/80 pt-6">
            <GradientButton variant="success" onClick={() => handleStatusChange("accepted")}>
              Accept
            </GradientButton>
            <GradientButton variant="danger" onClick={() => handleStatusChange("rejected")}>
              Reject
            </GradientButton>
          </div>
        </div>
      )}

      {owner && !interviewModel && (
        <GlassCard>
          <p className="text-sm text-slate-500">No completed interviews for this role yet.</p>
        </GlassCard>
      )}
    </div>
  );
}
