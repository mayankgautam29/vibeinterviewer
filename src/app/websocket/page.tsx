"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function WS() {
  const params = useParams();
  const jobId = params.id;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>("");

  useEffect(() => {
    if (!started) return;

    const socket = new WebSocket("ws://localhost:8000/ws");
    ws.current = socket;

    socket.onopen = () => {
      socket.send(
        `User's resume summary : Hi, I'm a backend developer with 3 years of experience in Python, FastAPI and JavaScript.
        Job's description : Backend role for a JavaScript, Python developer and have made good projects.`
      );
    };

    socket.onmessage = (event) => {
      if (interviewEnded) return;

      try {
        const data = JSON.parse(event.data);

        if (data.question) {
          setMessages((prev) => [...prev, `Server: ${data.question}`]);
        }

        if (
          typeof data.audio_base64 === "string" &&
          data.audio_base64.trim().length > 100
        ) {
          const binary = atob(data.audio_base64);
          const byteArray = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            byteArray[i] = binary.charCodeAt(i);
          }

          const audioBlob = new Blob([byteArray], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);

          setTimeout(() => {
            const audio = audioRef.current;
            if (audio) {
              audio.src = audioUrl;
              audio.onended = () => {
                if (!interviewEnded) startSpeechToText();
              };
              audio
                .play()
                .then(() => console.log("🔊 Audio playing"))
                .catch((err) => {
                  console.warn("⚠️ Audio play failed:", err);
                  if (!interviewEnded) startSpeechToText();
                });
            }
          }, 100);
        } else {
          if (!interviewEnded) startSpeechToText();
        }
      } catch {
        setMessages((prev) => [...prev, `Server: ${event.data}`]);
      }
    };

    socket.onclose = () => {
      setInterviewEnded(true);
      cleanupSpeech();
      setMessages((prev) => [...prev, "✅ Interview has ended. Thank you!"]);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
      cleanupSpeech();
    };
  }, [started]);

  const onSubmit = (text: string) => {
    if (
      ws.current?.readyState === WebSocket.OPEN &&
      text.trim() &&
      !interviewEnded
    ) {
      ws.current.send(text);
      setMessages((prev) => [...prev, `You: ${text}`]);
      setInput("");
      latestTranscriptRef.current = "";
    }
  };

  const startSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        "⚠️ Your browser doesn't support speech recognition.",
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    latestTranscriptRef.current = "";

    recognition.onresult = (event: any) => {
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

      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };

    recognition.onend = () => {
      const final = latestTranscriptRef.current.trim();
      if (final) onSubmit(final);
    };

    recognition.onerror = (e: any) => {
      if (e?.error === "no-speech" || e?.error === "aborted") {
        console.warn("Speech error:", e.error);
        return;
      }
      console.error("Speech recognition error:", e);
      setMessages((prev) => [
        ...prev,
        "⚠️ Speech recognition error. You can type your answer instead.",
      ]);
    };

    recognition.start();
  };

  const cleanupSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎙️ WebSocket Interview</h1>

      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Interview
        </button>
      ) : (
        <>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={interviewEnded}
              placeholder="Type your answer"
              className="border px-2 py-1 rounded w-full"
            />
            <button
              onClick={() => onSubmit(input)}
              disabled={interviewEnded}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Submit
            </button>
          </div>

          <ul className="list-disc pl-6 space-y-1 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>

          <audio ref={audioRef} hidden />
        </>
      )}
    </div>
  );
}
