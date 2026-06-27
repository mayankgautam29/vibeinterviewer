import {
  ArrowRight,
  BarChart3,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: MessageSquare,
    title: "Adaptive interviews",
    description:
      "Questions follow the candidate's answers instead of running through a fixed script.",
    tint: "sky",
  },
  {
    icon: FileText,
    title: "Resume-aware questioning",
    description:
      "Uploaded resumes are indexed so interviewers ask about relevant skills and experience.",
    tint: "teal",
  },
  {
    icon: Shield,
    title: "Integrity signals",
    description:
      "Response analysis and session snapshots give recruiters more context when reviewing candidates.",
    tint: "violet",
  },
  {
    icon: BarChart3,
    title: "Structured scoring",
    description:
      "Each session produces a summary, score, and notes recruiters can act on immediately.",
    tint: "amber",
  },
];

const tintClasses: Record<string, string> = {
  sky: "bg-sky-500/10 text-sky-400 ring-sky-500/25",
  teal: "bg-teal-500/10 text-teal-400 ring-teal-500/25",
  violet: "bg-violet-500/10 text-violet-400 ring-violet-500/25",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/25",
};

const steps = [
  { n: "01", title: "Upload a resume", body: "Candidates add a PDF or DOCX before applying." },
  { n: "02", title: "Complete the interview", body: "Voice or text responses in a guided session." },
  { n: "03", title: "Review results", body: "Recruiters see scores, summaries, and session data." },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-8">
      <section className="relative mx-auto max-w-3xl pt-4 text-center sm:pt-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-xs font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          AI-powered hiring platform
        </div>
        <h1 className="hero-title">
          Hire and interview with clarity, not guesswork
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
          VibeInterviewer helps candidates practice and apply, and gives recruiters structured
          interview results they can trust.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GradientButton href="/jobs">Browse open roles</GradientButton>
          <GradientButton href="/jobnew" variant="secondary">
            Post a job
            <ArrowRight className="h-4 w-4" />
          </GradientButton>
        </div>
      </section>

      <section>
        <div className="mb-8">
          <p className="section-label mb-2">Platform</p>
          <div className="accent-line mb-4" />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
            Built for both sides of the hiring table
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description, tint }) => (
            <GlassCard key={title} hover>
              <div className={cn("icon-box mb-4 ring-1", tintClasses[tint])}>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-slate-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8">
          <p className="section-label mb-2">Workflow</p>
          <div className="accent-line mb-4" />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">How it works</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ n, title, body }) => (
            <GlassCard key={n} hover={false} className="relative overflow-hidden">
              <span className="absolute -right-1 -top-3 font-mono text-6xl font-bold text-slate-800/80">
                {n}
              </span>
              <h3 className="relative font-medium text-slate-100">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <GlassCard className="max-w-2xl border-sky-500/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40">
          <p className="section-label mb-4">Example exchange</p>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-sky-500/15 bg-sky-500/5 p-4">
              <p className="mb-1 text-xs font-medium text-sky-400/90">Interviewer</p>
              <p className="text-slate-300">
                You mentioned a payments API — how did you handle idempotency for retries?
              </p>
            </div>
            <div className="rounded-lg border border-slate-700/60 bg-slate-950/40 p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">Candidate</p>
              <p className="text-slate-400">
                We stored a client-supplied key in Redis with a short TTL before processing...
              </p>
            </div>
            <div className="rounded-lg border border-teal-500/15 bg-teal-500/5 p-4">
              <p className="mb-1 text-xs font-medium text-teal-400/90">Evaluation</p>
              <p className="text-slate-400">
                Strong technical depth. Follow-up recommended on failure handling.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="surface rounded-xl px-6 py-12 text-center sm:px-10">
        <Users className="mx-auto mb-4 h-8 w-8 text-sky-400/80" strokeWidth={1.25} />
        <h2 className="text-xl font-semibold text-slate-100">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Create an account, upload your resume, and apply to open roles in minutes.
        </p>
        <div className="mt-8">
          <GradientButton href="/sign-up">Create account</GradientButton>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 pt-8 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} VibeInterviewer</p>
      </footer>
    </div>
  );
}
