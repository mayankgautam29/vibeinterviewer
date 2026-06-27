"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Briefcase, Building2, FileText } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

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
    <PageShell narrow>
      <PageHeader
        badge="Recruiters"
        title="Post a New Job"
        subtitle="Create a listing and let candidates complete AI-powered adaptive interviews."
      />

      <GlassCard className="space-y-5">
        <div>
          <label htmlFor="company" className="label-field">
            <Building2 className="mr-1.5 inline h-4 w-4 text-slate-500" />
            Company Name
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input-field"
            placeholder="e.g., Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="jobtitle" className="label-field">
            <Briefcase className="mr-1.5 inline h-4 w-4 text-slate-500" />
            Job Title
          </label>
          <input
            id="jobtitle"
            type="text"
            value={jobtitle}
            onChange={(e) => setJobtitle(e.target.value)}
            className="input-field"
            placeholder="e.g., Senior Frontend Engineer"
          />
        </div>

        <div>
          <label htmlFor="jobDesc" className="label-field">
            <FileText className="mr-1.5 inline h-4 w-4 text-slate-500" />
            Job Description
          </label>
          <textarea
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={6}
            className="input-field resize-none"
            placeholder="Describe the role, requirements, and what you're looking for..."
          />
        </div>

        <GradientButton
          onClick={onSubmit}
          disabled={!company || !jobtitle || !jobDesc}
          loading={loading}
          fullWidth
        >
          Publish Job Listing
        </GradientButton>
      </GlassCard>
    </PageShell>
  );
}
