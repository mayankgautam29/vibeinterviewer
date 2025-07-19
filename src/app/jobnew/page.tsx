"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Jobnew() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [jobtitle, setJobtitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!company || !jobtitle || !jobDesc) return;

    try {
      setLoading(true);
      await axios.post("/api/createjob", {
        jobtitle,
        jobdescription: jobDesc,
        company,
      });
      router.push("/jobs");
    } catch (error) {
      console.error("Job creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 animate-shimmer-dark mb-5">
        Post a New Job
      </span>

      <div className="space-y-4 mt-5">
        <div className="flex flex-col">
          <label htmlFor="company" className="mb-1 text-sm font-medium text-slate-300">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., OpenAI"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="jobtitle" className="mb-1 text-sm font-medium text-slate-300">
            Job Title
          </label>
          <input
            id="jobtitle"
            type="text"
            value={jobtitle}
            onChange={(e) => setJobtitle(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Frontend Engineer"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="jobDesc" className="mb-1 text-sm font-medium text-slate-300">
            Job Description
          </label>
          <textarea
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={5}
            className="bg-zinc-800 text-white p-3 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., We are hiring a talented..."
          ></textarea>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
