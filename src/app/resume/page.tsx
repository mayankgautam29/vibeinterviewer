"use client";

import { useState } from "react";
import axios from "axios";

export default function Resume() {
  const [message, setMessage] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const uploadPDF = async () => {
    if (!pdf) {
      return;
    }

    const formData = new FormData();
    formData.append("file", pdf);

    try {
      const res = await axios.post("http://localhost:8000/indexing", formData);
      const msg = JSON.stringify(res.data.message, null, 2);
      setMessage(msg);
      const res_2 = await axios.post("/api/resumeupload", { message: msg });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <p className="bg-white">{message}</p>
      <input
        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        type="file"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
      ></input>
      <button className="bg-red-300" onClick={uploadPDF}>
        Submit
      </button>
    </div>
  );
}
