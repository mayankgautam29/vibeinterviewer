"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

// Animation Variants
const fadeContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function AnimatedBlock({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4"
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div variants={fadeInUp} key={i}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={fadeInUp}>{children}</motion.div>}
    </motion.div>
  );
}

export default function Home() {
  const rotatingTexts = ["AI Based Mock Interviews", "Real time Feedback", "Resume Based Interview's!", "Voice & Text"];

  const [rotatingIndex, setRotatingIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-white overflow-hidden relative">
      <div className="px-4 sm:px-12 py-24 space-y-16">
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              Ace Your Next Interview with AI
            </h1>
            <p className="text-3xl font-medium text-slate-300 mb-15 mt-10 h-6">
              {rotatingTexts[rotatingIndex]}
            </p>

            <p className="text-lg sm:text-xl text-slate-300 mb-6">
              Simulate interviews, get instant feedback, and build confidence.
            </p>
            <div className="relative group w-fit mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-fuchsia-500 blur opacity-70 group-hover:opacity-100 transition duration-500 rounded-xl"></div>
              <a
                href="/jobs"
                className="relative inline-block px-6 py-2 text-white font-semibold bg-[#0f172a] border border-blue-500 rounded-xl transition"
              >
                See It in Action
              </a>
            </div>
          </section>
        </AnimatedBlock>
      </div>
      <div className="px-4 sm:px-12 py-20 space-y-32">
        <AnimatedBlock>
          <section className="text-center max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              Key Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left list-disc list-inside text-slate-300">
              <li>AI-Powered Mock Interviews</li>
              <li>Real-Time Feedback with Tips</li>
              <li>Covers Behavioral, Technical, and HR Rounds</li>
              <li>Custom Questions by Role (Frontend, Data Science, etc.)</li>
              <li>Resume Parsing for Relevant Questions</li>
              <li>Voice or Text-Based Interviews</li>
              <li>Progress Tracking & Performance Metrics</li>
            </ul>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              Sample Interview Experience
            </h2>
            <div className="relative group bg-[#141e33] p-6 rounded-xl text-left text-slate-300 overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
              <p><strong>Q:</strong> What’s your greatest weakness?</p>
              <p><strong>Your Answer:</strong> I tend to be a perfectionist and spend extra time polishing tasks.</p>
              <p><strong>AI Feedback:</strong> Consider balancing your strengths with how you’ve learned to manage this trait.</p>
            </div>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              What Our Users Say
            </h2>
            <div className="bg-[#1a2238] p-6 rounded-xl shadow-lg text-slate-300">
              <p>“I got confidence in myself using this!”</p>
              <p className="mt-2 font-semibold text-blue-400">– Mayank</p>
            </div>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300">
              <div className="bg-[#141e33] p-4 rounded-xl shadow">
                <h3 className="font-bold mb-2 text-white">1. Upload Resume</h3>
                <p>We tailor interview questions based on your profile.</p>
              </div>
              <div className="bg-[#141e33] p-4 rounded-xl shadow">
                <h3 className="font-bold mb-2 text-white">2. Start Interview</h3>
                <p>Choose voice or text and get AI-generated questions instantly.</p>
              </div>
              <div className="bg-[#141e33] p-4 rounded-xl shadow">
                <h3 className="font-bold mb-2 text-white">3. Get Feedback</h3>
                <p>See where you shine and where you can improve.</p>
              </div>
            </div>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              Why We Built This
            </h2>
            <p className="text-slate-300">
               We know how nerve-wracking interviews can be. Our mission is to democratize confident interviewing using AI.
            </p>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">
              Your Privacy Matters
            </h2>
            <p className="text-slate-300">
              We never share your data. GDPR compliant. All mock interviews are private and encrypted.
            </p>
          </section>
        </AnimatedBlock>
        <AnimatedBlock>
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Ready to Get Started?
            </h2>
            <div className="relative group w-fit mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 blur opacity-70 group-hover:opacity-100 transition duration-500 rounded-xl"></div>
              <a
                href="/jobs"
                className="relative inline-block px-8 py-3 text-white font-semibold bg-[#0f172a] border border-green-500 rounded-xl transition"
              >
                Start Practicing Now
              </a>
            </div>
          </section>
        </AnimatedBlock>
      </div>
      <motion.footer
        className="text-center text-slate-400 text-sm pt-16 pb-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div>&copy; {new Date().getFullYear()} Mayank Gautam. All rights reserved.</div>
      </motion.footer>
    </div>
  );
}
