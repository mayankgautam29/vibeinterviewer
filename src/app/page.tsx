"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Mic,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Video,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const features = [
  { icon: Brain, title: "Adaptive AI Interviews", desc: "Follow-up questions that probe your real experience, not a fixed script." },
  { icon: Mic, title: "Voice & Text Answers", desc: "Speak naturally or type — the AI adapts to how you communicate best." },
  { icon: Target, title: "Resume-Tailored Questions", desc: "Vector-indexed resume context drives relevant, role-specific interviews." },
  { icon: Shield, title: "Integrity Monitoring", desc: "Snapshot capture and answer analysis help detect suspicious responses." },
  { icon: TrendingUp, title: "Live Quality Scoring", desc: "Real-time evaluation so interviews end when enough signal is gathered." },
  { icon: Video, title: "Recruiter Review", desc: "Hiring managers see scores, summaries, snapshots, and integrity notes." },
];

const steps = [
  { step: "01", title: "Upload Resume", desc: "PDF or DOCX — we summarize and index it for smart question generation.", icon: Upload },
  { step: "02", title: "Start Interview", desc: "Camera on, mic ready. Adaptive questions based on your profile and answers.", icon: Sparkles },
  { step: "03", title: "Get Evaluated", desc: "AI scores your performance and sends results to recruiters instantly.", icon: Zap },
];

export default function Home() {
  const rotatingTexts = [
    "Adaptive AI Interviews",
    "Real-Time Feedback",
    "Resume-Based Questions",
    "Voice & Text Support",
  ];
  const [rotatingIndex, setRotatingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <PageShell className="pb-20 pt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Hiring Platform
          </motion.span>

          <motion.h1 variants={fadeInUp} className="gradient-text text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Ace Your Next Interview with AI
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 h-8 text-xl font-medium text-cyan-200/80">
            {rotatingTexts[rotatingIndex]}
          </motion.p>

          <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Practice with adaptive mock interviews, get instant feedback, and apply to jobs — all in one platform built for modern hiring.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GradientButton href="/jobs" variant="primary">
              Browse Jobs
            </GradientButton>
            <GradientButton href="/resume" variant="violet">
              Upload Resume
            </GradientButton>
          </motion.div>
        </motion.div>
      </PageShell>

      {/* Features */}
      <PageShell className="py-16">
        <div className="mb-12 text-center">
          <h2 className="gradient-text text-3xl font-bold sm:text-4xl">Why VibeInterviewer?</h2>
          <p className="mt-3 text-slate-400">Everything you need to prepare and get hired.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <GlassCard key={title} hover className="group">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 transition group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </PageShell>

      {/* How it works */}
      <PageShell className="py-16">
        <div className="mb-12 text-center">
          <h2 className="gradient-text text-3xl font-bold">How It Works</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ step, title, desc, icon: Icon }) => (
            <GlassCard key={step} className="relative overflow-hidden">
              <span className="absolute -right-2 -top-4 text-7xl font-black text-white/[0.03]">{step}</span>
              <Icon className="mb-4 h-8 w-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </PageShell>

      {/* Sample */}
      <PageShell narrow className="py-16">
        <GlassCard className="glow-ring">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-cyan-400">Sample Exchange</p>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-indigo-500/10 p-4 border border-indigo-500/20">
              <span className="font-semibold text-indigo-300">Interviewer:</span>
              <p className="mt-1 text-slate-300">You mentioned building a FastAPI service — walk me through how you handled authentication.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <span className="font-semibold text-slate-300">You:</span>
              <p className="mt-1 text-slate-400">We used JWT with refresh tokens stored in HTTP-only cookies...</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20">
              <span className="font-semibold text-emerald-300">AI Evaluation:</span>
              <p className="mt-1 text-slate-300">Strong technical depth. Follow-up: ask about token rotation edge cases.</p>
            </div>
          </div>
        </GlassCard>
      </PageShell>

      {/* CTA */}
      <PageShell className="py-20 text-center">
        <h2 className="gradient-text text-3xl font-bold sm:text-4xl">Ready to Get Started?</h2>
        <p className="mx-auto mt-4 max-w-lg text-slate-400">
          Join candidates who practice smarter and recruiters who hire with confidence.
        </p>
        <div className="mt-8">
          <GradientButton href="/jobs" variant="success" className="px-10 py-4 text-base">
            Start Practicing Now
          </GradientButton>
        </div>
      </PageShell>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} VibeInterviewer. All rights reserved.</p>
        <p className="mt-2 text-xs text-slate-600">Private · Encrypted · GDPR conscious</p>
      </footer>
    </div>
  );
}
