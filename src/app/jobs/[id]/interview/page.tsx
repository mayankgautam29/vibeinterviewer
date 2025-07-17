"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function WS() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [started, setStarted] = useState(false);

  const socket = useRef<WebSocket | null>(null);
  const recognition = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const latestTranscriptRef = useRef("");

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.question) {
          setMessages((prev) => [...prev, `🧠 Server: ${data.question}`]);

          if (data.audio_base64) {
            const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
            audioRef.current = audio;

            audio.onended = () => {
              recognition.current?.start();
            };

            audio.play().catch((err) => {
              console.error("❌ Audio playback error:", err);
              recognition.current?.start();
            });
          }
        }
      } catch (err) {
        setMessages((prev) => [...prev, `📩 Server: ${event.data}`]);

        if (event.data.includes("Interview complete")) {
          setInterviewEnded(true);
          setStarted(false);
        }
      }
    };

    socket.current.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleStartInterview = async () => {
    setStarted(true);

    try {
      const [resumeRes, jobRes] = await Promise.all([
        axios.post("/api/getuserresume"),
        axios.post("/api/getjobdesc", { jobId: "6878fda8deb6d8a06753d6f0" }),
      ]);

      const userResume = resumeRes.data?.summary || "No resume summary found";
      const jobDescObj = jobRes.data?.desc || { message: "No job description found" };
      const jobDescStr = typeof jobDescObj === "string" ? jobDescObj : JSON.stringify(jobDescObj, null, 2);

      const combinedMessage = `✅ Resume summary: ${userResume}\n📄 Job description: ${jobDescStr}`;

      setMessages((prev) => [...prev, `📝 Sent: Resume + Job description`]);
      socket.current?.send(combinedMessage);
    } catch (err) {
      console.error("❌ Failed to fetch resume or job description:", err);
      setMessages((prev) => [...prev, "❌ Failed to fetch resume or job description."]);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
    <div className="p-4 max-w-xl mx-auto">
      {!started && !interviewEnded && (
        <button
          onClick={handleStartInterview}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          🎙️ Start Interview
        </button>
      )}

      {interviewEnded && (
        <div className="text-green-700 font-semibold mt-2">
          ✅ Interview Completed. Thank you!
        </div>
      )}

      <div className="mt-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 rounded shadow-sm text-white">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
