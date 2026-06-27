"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { FileUp } from "lucide-react";
import { config } from "@/lib/config";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BackLink } from "@/components/ui/back-link";

export default function Resume() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { userId } = useAuth();

  const uploadPDF = async () => {
    if (!pdf) return;
    const formData = new FormData();
    formData.append("file", pdf);
    if (userId) formData.append("userId", userId);
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.post(config.indexingUrl, formData);
      const msg = JSON.stringify(res.data.message, null, 2);
      await axios.post("/api/resumeupload", { message: msg });
      setStatus("Resume uploaded. Redirecting…");
      setTimeout(() => router.push("/jobs"), 1000);
    } catch {
      setStatus("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell narrow>
      <BackLink href="/profile">Profile</BackLink>

      <PageHeader
        badge="Setup"
        title="Upload resume"
        subtitle="PDF or DOCX. We extract and index your experience for interview questions."
        centered={false}
        className="mt-6"
      />

      <GlassCard className="space-y-5">
        <label
          className={`flex cursor-pointer flex-col items-center rounded-lg border border-dashed px-6 py-12 text-center transition-colors ${
            pdf
              ? "border-teal-500/30 bg-teal-500/5"
              : "border-slate-700/80 hover:border-sky-500/30 hover:bg-sky-500/[0.03]"
          }`}
        >
          <FileUp className="mb-3 h-8 w-8 text-slate-500" strokeWidth={1.25} />
          {pdf ? (
            <>
              <p className="text-sm font-medium text-slate-200">{pdf.name}</p>
              <p className="mt-1 text-xs text-slate-500">{(pdf.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-300">Choose a file or drag it here</p>
              <p className="mt-1 text-xs text-slate-600">PDF, DOCX</p>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </label>

        <GradientButton onClick={uploadPDF} disabled={!pdf || loading} loading={loading} fullWidth>
          {loading ? "Processing…" : "Upload resume"}
        </GradientButton>

        {status && (
          <p
            className={`text-center text-sm ${
              status.includes("failed") ? "text-red-400" : "text-teal-400/90"
            }`}
          >
            {status}
          </p>
        )}
      </GlassCard>
    </PageShell>
  );
}
