"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type JobType = {
  _id: string;
  jobtitle: string;
  company: string;
  jobdescription: string;
  jobByUser?: { username: string; profileImg: string };
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
  integrityNotes?: string;
  cheatingFlags?: string[];
  questionCount?: number;
  screenshots?: { data: string; timestamp: string; questionNumber: number }[];
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  accepted: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  rejected: "bg-rose-500/10 text-rose-300 border-rose-500/30",
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
          const isOwner = ownerRes.data.owner;
          setOwner(isOwner);

          if (isOwner) {
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
      console.error("Failed to update status", err);
    }
  };

  const handleApplyClick = () => {
    if (!usr?.resume) router.push("/resume");
    else router.push(`/jobs/${job?._id}/interview`);
  };

  if (loading) return <LoadingSpinner label="Loading job details..." />;

  return (
    <PageShell narrow>
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <GlassCard className="glow-ring mb-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{job?.jobtitle}</h1>
            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <Building2 className="h-4 w-4" />
              {job?.company}
            </div>
          </div>
          {!owner && !interviewed && (
            <GradientButton onClick={handleApplyClick}>Apply & Interview</GradientButton>
          )}
        </div>

        <p className="leading-relaxed text-slate-300">{job?.jobdescription}</p>

        {job?.jobByUser && (
          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <img
              src={job.jobByUser.profileImg}
              alt=""
              className="h-10 w-10 rounded-full ring-2 ring-cyan-500/30"
            />
            <div>
              <p className="text-xs text-slate-500">Posted by</p>
              <p className="font-medium text-white">{job.jobByUser.username}</p>
            </div>
          </div>
        )}
      </GlassCard>

      {!owner && interviewed && (
        <GlassCard className="mb-6 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="font-medium text-white">Application submitted</p>
              <p className="text-sm text-slate-400">
                Status:{" "}
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${statusColors[userInterview?.status || "pending"]}`}>
                  {userInterview?.status}
                </span>
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {owner && interviewModel && (
        <GlassCard>
          <div className="mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Candidate Review</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-cyan-300">{interviewModel.interviewScore}</p>
              <p className="text-xs text-slate-500 mt-1">Score / 100</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-white">{interviewModel.questionCount ?? "—"}</p>
              <p className="text-xs text-slate-500 mt-1">Questions</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm capitalize ${statusColors[interviewModel.status]}`}>
                {interviewModel.status}
              </span>
              <p className="text-xs text-slate-500 mt-2">Status</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-1">Candidate</p>
          <p className="font-semibold text-white mb-4">{usr?.username}</p>

          {interviewModel.integrityNotes && (
            <div className="mb-4 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <Shield className="h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-300">Integrity Notes</p>
                <p className="text-sm text-slate-400 mt-1">{interviewModel.integrityNotes}</p>
              </div>
            </div>
          )}

          {interviewModel.cheatingFlags && interviewModel.cheatingFlags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {interviewModel.cheatingFlags.map((flag) => (
                <span key={flag} className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-300 border border-rose-500/20">
                  {flag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-white/[0.03] p-4 border border-white/10 mb-4">
            <p className="text-sm font-medium text-slate-300 mb-2">Interview Summary</p>
            <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-wrap">
              {interviewModel.interviewSummary || "No summary available."}
            </p>
          </div>

          {snapshots.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-white mb-3">
                Interview Snapshots ({snapshots.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {snapshots.map((shot, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={`data:image/jpeg;base64,${shot.data}`}
                      alt=""
                      className="h-28 w-full object-cover transition group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-cyan-200">
                      Q{shot.questionNumber || "?"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <GradientButton variant="success" onClick={() => handleStatusChange("accepted")}>
              <CheckCircle className="h-4 w-4" />
              Accept
            </GradientButton>
            <GradientButton variant="danger" onClick={() => handleStatusChange("rejected")}>
              <XCircle className="h-4 w-4" />
              Reject
            </GradientButton>
          </div>
        </GlassCard>
      )}

      {owner && !interviewModel && (
        <GlassCard className="text-center py-10">
          <Clock className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <p className="text-slate-400">No candidates have completed an interview yet.</p>
        </GlassCard>
      )}
    </PageShell>
  );
}
