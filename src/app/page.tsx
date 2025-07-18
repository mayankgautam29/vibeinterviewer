"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
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
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
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
  return (
    <div className="font-sans min-h-screen text-white px-4 sm:px-12 py-16 overflow-x-hidden relative space-y-32 ">

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Ace Your Next Interview with AI-Powered Practice
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-4">
            Simulate real interviews, get instant feedback, and build confidence — all with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="border border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 font-semibold py-2 px-6 rounded-xl transition"
            >
              See It in Action
            </a>
          </div>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Key Benefits</h2>
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
        <section id="how-it-works" className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <ol className="text-left space-y-3 text-slate-300 list-decimal list-inside">
            <li>Choose your role and experience level</li>
            <li>Get matched with an AI interviewer</li>
            <li>Answer live via mic or chat</li>
            <li>Receive feedback instantly</li>
            <li>Review answers and retry</li>
          </ol>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Who Is It For?</h2>
          <ul className="text-left space-y-3 text-slate-300 list-disc list-inside">
            <li>Students/Graduates – Ace your campus placements</li>
            <li>Professionals Switching Jobs – Practice behavioral and coding rounds</li>
            <li>Career Changers – Rebuild confidence for interviews</li>
            <li>Hiring Teams – Use AI interviews to screen candidates</li>
          </ul>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Powerful AI Under the Hood</h2>
          <ul className="text-left space-y-3 text-slate-300 list-disc list-inside">
            <li>AI Powered Interviewer</li>
            <li>Adapts Questions Based on Your Answers</li>
            <li>Voice Recognition for Natural Conversations</li>
            <li>Feedback on Body Language, Tone, Filler Words</li>
            <li>Resume Analyzer: Tailored Questions</li>
          </ul>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Sample Interview Experience</h2>
          <div className="bg-[#141e33] p-6 rounded-xl text-left text-slate-300">
            <p><strong>Q:</strong> What’s your greatest weakness?</p>
            <p><strong>Your Answer:</strong> I tend to be a perfectionist and spend extra time polishing tasks.</p>
            <p><strong>AI Feedback:</strong> Consider balancing your strengths with how you’ve learned to manage this trait.</p>
          </div>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Inside the Platform</h2>
          <p className="text-slate-300">See what it's like to use VibeInterviewer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white text-black p-2 rounded">Interview Interface Screenshot</div>
            <div className="bg-white text-black p-2 rounded">Feedback Dashboard Screenshot</div>
          </div>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">FAQs</h2>
          <ul className="text-left text-slate-300 space-y-3">
            <li><strong>How is this different from YouTube practice videos?</strong> → You get interactive, personalized AI feedback.</li>
            <li><strong>Will the AI understand technical answers?</strong> → Yes, it’s trained on tech interviews.</li>
            <li><strong>Do I need to speak or can I type?</strong> → Both options are supported.</li>
            <li><strong>Can I retry questions?</strong> → Absolutely, as many times as you like.</li>
            <li><strong>Will my data be saved?</strong> → Only with your permission, encrypted.</li>
          </ul>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Why We Built This</h2>
          <p className="text-slate-300">
            As ex-candidates and hiring managers, we know how nerve-wracking interviews can be. Our mission is to democratize confident interviewing using AI.
          </p>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Join Our Community</h2>
          <a href="https://www.linkedin.com/in/mayank-gautam29" className="text-blue-400 underline">LinkedIn</a>
        </section>
      </AnimatedBlock>

      <AnimatedBlock>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Your Privacy Matters</h2>
          <p className="text-slate-300">We never share your data. GDPR compliant. All mock interviews are private and encrypted.</p>
        </section>
      </AnimatedBlock>

      <motion.footer
        className="text-center text-slate-500 text-sm pt-16 space-y-2"
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
