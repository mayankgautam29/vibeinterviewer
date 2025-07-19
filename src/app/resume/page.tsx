"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud } from "lucide-react";

export default function Resume() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const uploadPDF = async () => {
    if (!pdf) return;

    const formData = new FormData();
    formData.append("file", pdf);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/indexing", formData);
      const msg = JSON.stringify(res.data.message, null, 2);
      await axios.post("/api/resumeupload", { message: msg });

      // Redirect after upload
      router.push("/jobs");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-shimmer mb-10">
        Upload Your Resume
      </h1>

      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-2xl p-8 shadow-xl border border-[#333] space-y-6">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-500 file:text-white hover:file:brightness-110"
        />

        <button
          onClick={uploadPDF}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              Upload Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}
