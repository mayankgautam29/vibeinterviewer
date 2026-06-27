"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { FileText, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { config } from "@/lib/config";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Resume() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);
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

      const indexed = res.data.indexed ?? 0;
      const cached = res.data.cached ? " (from cache)" : "";
      setStatus(`Resume indexed with ${indexed} vector chunks${cached}. Redirecting...`);

      setTimeout(() => router.push("/jobs"), 1200);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell narrow>
      <PageHeader
        badge="Step 1"
        title="Upload Your Resume"
        subtitle="We'll summarize and vector-index your resume so interviews ask the right questions."
      />

      <GlassCard className="space-y-6">
        <div
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
            dragOver
              ? "border-violet-400 bg-violet-500/10"
              : pdf
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/15 bg-white/[0.02] hover:border-violet-500/40"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) setPdf(file);
          }}
        >
          {pdf ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <p className="font-medium text-white">{pdf.name}</p>
              <p className="text-sm text-slate-400">{(pdf.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                <FileText className="h-7 w-7 text-violet-400" />
              </div>
              <p className="font-medium text-white">Drop your resume here</p>
              <p className="text-sm text-slate-500">PDF or DOCX · Max recommended 5MB</p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>

        <GradientButton
          onClick={uploadPDF}
          disabled={!pdf || loading}
          loading={loading}
          variant="violet"
          fullWidth
        >
          {!loading && <UploadCloud className="h-5 w-5" />}
          {loading ? "Processing & Indexing..." : "Upload & Index Resume"}
        </GradientButton>

        {status && (
          <p className={`text-center text-sm ${status.includes("failed") ? "text-rose-400" : "text-emerald-400"}`}>
            {status}
          </p>
        )}
      </GlassCard>
    </PageShell>
  );
}
