"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function WS() {
  const params = useParams();
  const jobId = params?.id as string;
  const { userId } = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const socket = useRef<WebSocket | null>(null);
  const recognition = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const latestTranscriptRef = useRef("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Access camera
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Camera access error:", err));
    }

    // WebSocket setup
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setSocketReady(true);
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.question) {
          setMessages((prev) => [...prev, `🧠 Server: ${data.question}`]);

          if (data.audio_base64) {
            const audio = new Audio(
              `data:audio/wav;base64,${data.audio_base64}`
            );
            audioRef.current = audio;

            audio.onended = () => recognition.current?.start();

            audio.play().catch((err) => {
              console.error("❌ Audio playback error:", err);
              recognition.current?.start();
            });
          }
        }
      } catch {
        setMessages((prev) => [...prev, `📩 Server: ${event.data}`]);

        if (event.data.includes("Interview complete")) {
          setInterviewEnded(true);
          setStarted(false);
        }
      }
    };

    socket.current.onclose = () => console.log("🔌 WebSocket closed");

    return () => socket.current?.close();
  }, []);

  const handleStartInterview = async () => {
    if (!jobId) {
      setMessages((prev) => [...prev, "❌ No jobId found in URL."]);
      return;
    }

    setStarted(true);

    try {
      const [resumeRes, jobRes] = await Promise.all([
        axios.post("/api/getuserresume"),
        axios.post("/api/getjobdesc", { jobId }),
      ]);

      const userResume = resumeRes.data?.summary || "No resume summary found";
      const jobDesc = jobRes.data?.desc || "No job description found";
      const jobDescStr =
        typeof jobDesc === "string" ? jobDesc : JSON.stringify(jobDesc);

      const combined = `Resume summary: ${userResume}\nJob description: ${jobDescStr}\njobId: ${jobId}\nuserId: ${userId}`;
      setMessages((prev) => [...prev, "📝 Sent: Resume + Job description"]);
      socket.current?.send(combined);
    } catch (err) {
      console.error("❌ Failed to fetch resume or job description:", err);
      setMessages((prev) => [
        ...prev,
        "❌ Failed to fetch resume or job description.",
      ]);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            latestTranscriptRef.current += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        setInput(latestTranscriptRef.current + interim);
      };

      recognition.current.onend = () => {
        const finalAnswer = latestTranscriptRef.current.trim();
        if (finalAnswer !== "") {
          setMessages((prev) => [...prev, `🧑 You: ${finalAnswer}`]);
          socket.current?.send(finalAnswer);
          latestTranscriptRef.current = "";
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error("🎤 Speech recognition error:", event.error);
      };
    }
  }, [interviewEnded]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-lg aspect-video min-h-[500px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div className="flex-1 flex flex-col max-h-[90vh]">
        {!socketReady && (
          <div className="text-yellow-300 font-semibold mb-2 animate-pulse">
            🔄 Connecting to server...
          </div>
        )}

        {!started && !interviewEnded && (
          <button
            onClick={handleStartInterview}
            disabled={!socketReady}
            className={`px-4 py-2 rounded text-white font-semibold mb-4 transition ${
              socketReady
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            🎙️ Start Interview
          </button>
        )}

        {interviewEnded && (
          <div className="text-green-400 font-semibold mt-2">
            ✅ Interview Completed. Thank you!
          </div>
        )}

        <div className="overflow-y-auto flex-1 space-y-3 bg-zinc-900 rounded-xl p-5 border border-zinc-700 shadow-inner max-h-[75vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg shadow-sm text-sm whitespace-pre-wrap ${
                msg.startsWith("🧑")
                  ? "bg-zinc-800 text-white"
                  : "bg-indigo-800 text-white"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
