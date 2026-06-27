"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BackLink } from "@/components/ui/back-link";

export default function Jobnew() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [jobtitle, setJobtitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!company || !jobtitle || !jobDesc) return;
    setError("");
    try {
      setLoading(true);
      await axios.post("/api/createjob", {
        jobtitle,
        jobdescription: jobDesc,
        company,
      });
      router.push("/jobs");
    } catch {
      setError("Could not publish listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell narrow>
      <BackLink href="/jobs">Jobs</BackLink>

      <PageHeader
        badge="Recruiters"
        title="Post a job"
        subtitle="Create a listing. Candidates complete an adaptive interview when they apply."
        centered={false}
        className="mt-6"
      />

      <GlassCard className="space-y-5">
        <div>
          <label htmlFor="company" className="label-field">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input-field"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label htmlFor="jobtitle" className="label-field">
            Job title
          </label>
          <input
            id="jobtitle"
            type="text"
            value={jobtitle}
            onChange={(e) => setJobtitle(e.target.value)}
            className="input-field"
            placeholder="Senior Engineer"
          />
        </div>
        <div>
          <label htmlFor="jobDesc" className="label-field">
            Description
          </label>
          <textarea
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={6}
            className="input-field resize-none"
            placeholder="Role responsibilities, requirements, team context…"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <GradientButton
          onClick={onSubmit}
          disabled={!company || !jobtitle || !jobDesc}
          loading={loading}
          fullWidth
        >
          Publish listing
        </GradientButton>
      </GlassCard>
    </PageShell>
  );
}
