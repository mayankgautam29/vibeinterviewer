import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";
import { HomeJobsPreview } from "@/components/home-jobs-preview";

export default function Home() {
  return (
    <div className="pb-12">
      {/* Hero — left-aligned, no centered marketing block */}
      <header className="border-b border-slate-800/80 pb-12 pt-2">
        <p className="section-label mb-3">Interview platform</p>
        <h1 className="max-w-2xl text-3xl font-semibold leading-snug tracking-tight text-slate-50 sm:text-4xl">
          Post a role. Candidates interview. You review the results.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          VibeInterviewer runs adaptive voice or text interviews from a candidate&apos;s resume,
          then delivers scores, summaries, and session data to whoever posted the job.
        </p>
      </header>

      {/* Two paths — functional, not feature marketing */}
      <section className="grid gap-4 py-12 sm:grid-cols-2">
        <Link
          href="/jobs"
          className="group surface surface-hover block rounded-xl p-6 sm:p-8"
        >
          <p className="text-sm font-medium text-sky-400">Candidates</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-100">Find a role and interview</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Upload your resume once, apply to an opening, and complete the session from your browser.
          </p>
          <span className="mt-6 inline-block text-sm text-slate-400 group-hover:text-sky-300">
            View jobs →
          </span>
        </Link>

        <Link
          href="/jobnew"
          className="group surface surface-hover block rounded-xl p-6 sm:p-8"
        >
          <p className="text-sm font-medium text-teal-400">Recruiters</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-100">Post a job and review applicants</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Create a listing, let candidates interview asynchronously, then accept or reject from one place.
          </p>
          <span className="mt-6 inline-block text-sm text-slate-400 group-hover:text-teal-300">
            Post a job →
          </span>
        </Link>
      </section>

      {/* Live data — same list pattern as /jobs */}
      <section className="pb-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label mb-2">Openings</p>
            <h2 className="text-lg font-semibold text-slate-100">Recent roles</h2>
          </div>
          <Link href="/jobs" className="text-sm text-slate-500 hover:text-sky-400">
            See all
          </Link>
        </div>
        <HomeJobsPreview />
      </section>

      {/* Process — single column timeline, not 3-card grid */}
      <section className="border-t border-slate-800/80 pt-12">
        <p className="section-label mb-2">Process</p>
        <h2 className="mb-8 text-lg font-semibold text-slate-100">What happens end to end</h2>
        <ol className="space-y-0 border-l border-slate-800 ml-3">
          {[
            {
              title: "Resume is uploaded and indexed",
              body: "Skills and experience are extracted so questions stay relevant to the role.",
            },
            {
              title: "Candidate completes an adaptive interview",
              body: "The session adjusts follow-ups based on answers — not a fixed question list.",
            },
            {
              title: "Recruiter receives a structured review",
              body: "Score, written summary, integrity notes, and optional session snapshots.",
            },
          ].map((step) => (
            <li key={step.title} className="relative pb-10 pl-8 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-700 ring-4 ring-[#0b1120]" />
              <p className="font-medium text-slate-200">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Account — inline, not a big CTA banner */}
      <section className="mt-12 flex flex-col gap-4 border-t border-slate-800/80 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          New here? Create an account to apply or post jobs.
        </p>
        <div className="flex gap-3">
          <GradientButton href="/sign-up" size="sm">
            Sign up
          </GradientButton>
          <GradientButton href="/sign-in" variant="secondary" size="sm">
            Sign in
          </GradientButton>
        </div>
      </section>
    </div>
  );
}
