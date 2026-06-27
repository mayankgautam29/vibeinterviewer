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

const features = [
  {
    icon: MessageSquare,
    title: "Adaptive interviews",
    description:
      "Questions follow the candidate's answers instead of running through a fixed script.",
  },
  {
    icon: FileText,
    title: "Resume-aware questioning",
    description:
      "Uploaded resumes are indexed so interviewers ask about relevant skills and experience.",
  },
  {
    icon: Shield,
    title: "Integrity signals",
    description:
      "Response analysis and session snapshots give recruiters more context when reviewing candidates.",
  },
  {
    icon: BarChart3,
    title: "Structured scoring",
    description:
      "Each session produces a summary, score, and notes recruiters can act on immediately.",
  },
];

const steps = [
  { n: "01", title: "Upload a resume", body: "Candidates add a PDF or DOCX before applying." },
  { n: "02", title: "Complete the interview", body: "Voice or text responses in a guided session." },
  { n: "03", title: "Review results", body: "Recruiters see scores, summaries, and session data." },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-8">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-4 text-center sm:pt-10">
        <p className="section-label mb-4">AI interview platform</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.1]">
          Hire and interview with clarity, not guesswork
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
          VibeInterviewer helps candidates practice and apply, and gives recruiters structured
          interview results they can trust.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GradientButton href="/jobs">Browse open roles</GradientButton>
          <GradientButton href="/jobnew" variant="secondary">
            Post a job
            <ArrowRight className="h-4 w-4" />
          </GradientButton>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-8">
          <p className="section-label mb-2">Platform</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Built for both sides of the hiring table
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <GlassCard key={title} hover={false}>
              <Icon className="mb-4 h-5 w-5 text-zinc-400" strokeWidth={1.5} />
              <h3 className="font-medium text-zinc-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="mb-8">
          <p className="section-label mb-2">Workflow</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">How it works</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="border-l border-zinc-800 pl-5">
              <span className="font-mono text-xs text-zinc-600">{n}</span>
              <h3 className="mt-2 font-medium text-zinc-100">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample */}
      <section>
        <GlassCard className="max-w-2xl">
          <p className="section-label mb-4">Example exchange</p>
          <div className="space-y-4 text-sm">
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-500">Interviewer</p>
              <p className="text-zinc-300">
                You mentioned a payments API — how did you handle idempotency for retries?
              </p>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <p className="mb-1 text-xs font-medium text-zinc-500">Candidate</p>
              <p className="text-zinc-400">
                We stored a client-supplied key in Redis with a short TTL before processing...
              </p>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <p className="mb-1 text-xs font-medium text-zinc-500">Evaluation</p>
              <p className="text-zinc-400">
                Strong technical depth. Follow-up recommended on failure handling.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA */}
      <section className="surface rounded-lg px-6 py-10 text-center sm:px-10">
        <Users className="mx-auto mb-4 h-6 w-6 text-zinc-500" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold text-zinc-100">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Create an account, upload your resume, and apply to open roles in minutes.
        </p>
        <div className="mt-6">
          <GradientButton href="/sign-up" variant="primary">
            Create account
          </GradientButton>
        </div>
      </section>

      <footer className="border-t border-zinc-800 pt-8 text-center text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} VibeInterviewer</p>
      </footer>
    </div>
  );
}
