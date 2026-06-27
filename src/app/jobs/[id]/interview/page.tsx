"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { config } from "@/lib/config";
import {
  Camera,
  Mic,
  Send,
  Wifi,
  WifiOff,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: { isFinal: boolean; [index: number]: SpeechRecognitionResultItem };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const w = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type WsMessage = {
  type?: string;
  message?: string;
  question?: string;
  audio_base64?: string;
  questionNumber?: number;
  totalQuestions?: number;
  adaptive?: boolean;
  minQuestions?: number;
  maxQuestions?: number;
  runningScore?: number;
  answerType?: string;
  score?: number;
  endReason?: string;
  integrityNotes?: string;
};

const SNAPSHOT_INTERVAL_MS = 30000;

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const { userId } = useAuth();

  const [messages, setMessages] = useState<
    { role: "user" | "ai" | "system"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [runningScore, setRunningScore] = useState<number | null>(null);
  const [maxQuestions, setMaxQuestions] = useState(12);
  const [minQuestions, setMinQuestions] = useState(3);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [endReason, setEndReason] = useState("");

  const socket = useRef<WebSocket | null>(null);
  const recognition = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const latestTranscriptRef = useRef("");
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const snapshotTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionNumberRef = useRef(0);
  const interviewEndedRef = useRef(false);
  const questionStartTimeRef = useRef<number>(0);

  const addMessage = useCallback(
    (role: "user" | "ai" | "system", text: string) => {
      setMessages((prev) => [...prev, { role, text }]);
    },
    []
  );

  useEffect(() => {
    interviewEndedRef.current = interviewEnded;
  }, [interviewEnded]);

  const playAudio = (audioBase64: string) => {
    if (!audioBase64 || audioBase64.length < 100) {
      startSpeechRecognition();
      return;
    }

    const binary = atob(audioBase64);
    const byteArray = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      byteArray[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.src = url;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (!interviewEndedRef.current) startSpeechRecognition();
    };
    audio.play().catch(() => {
      URL.revokeObjectURL(url);
      if (!interviewEndedRef.current) startSpeechRecognition();
    });
  };

  const captureAndUploadSnapshot = useCallback(async () => {
    if (!videoRef.current || !userId || !jobId || interviewEnded) return;

    const video = videoRef.current;
    if (video.videoWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = Math.min(video.videoWidth, 640);
    canvas.height = Math.min(
      video.videoHeight,
      Math.round((canvas.width / video.videoWidth) * video.videoHeight)
    );
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.55).split(",")[1];

    try {
      await Promise.all([
        axios.post("/api/upload-screenshot", {
          jobId,
          imageBase64,
          questionNumber: questionNumberRef.current,
        }),
        axios
          .post(`${config.interviewApiUrl}/screenshot`, {
            userId,
            jobId,
            imageBase64,
            questionNumber: questionNumberRef.current,
          })
          .catch(() => null),
      ]);
      setSnapshotCount((c) => c + 1);
    } catch (err) {
      console.error("Snapshot upload failed:", err);
    }
  }, [userId, jobId, interviewEnded]);

  const cleanupSpeech = () => {
    recognition.current?.stop();
    recognition.current = null;
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setIsListening(false);
  };

  const submitAnswer = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || interviewEnded || !socket.current) return;
    addMessage("user", trimmed);

    const responseTimeMs = questionStartTimeRef.current
      ? Date.now() - questionStartTimeRef.current
      : 0;

    socket.current.send(
      JSON.stringify({
        type: "answer",
        text: trimmed,
        responseTimeMs,
      })
    );
    setInput("");
    latestTranscriptRef.current = "";
    cleanupSpeech();
    setIsEvaluating(true);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor || interviewEnded) return;

    cleanupSpeech();
    const recognitionInstance = new SpeechRecognitionCtor();
    recognition.current = recognitionInstance;
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";
    setIsListening(true);

    recognitionInstance.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
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
        recognitionInstance.stop();
      }, 2500);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      const finalAnswer = latestTranscriptRef.current.trim();
      if (finalAnswer) submitAnswer(finalAnswer);
    };

    recognitionInstance.onerror = () => setIsListening(false);
    recognitionInstance.start();
  };

  useEffect(() => {
    questionNumberRef.current = questionNumber;
  }, [questionNumber]);

  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() =>
          setCameraError("Camera access denied. Interview can continue without snapshots.")
        );
    }

    socket.current = new WebSocket(config.wsUrl);
    socket.current.onopen = () => setSocketReady(true);
    socket.current.onclose = () => setSocketReady(false);

    socket.current.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data);

        if (data.type === "status" && data.message) {
          addMessage("system", data.message);
          return;
        }

        if (data.type === "complete") {
          setInterviewEnded(true);
          setStarted(false);
          setIsEvaluating(false);
          if (data.score != null) setFinalScore(data.score);
          if (data.endReason) setEndReason(data.endReason);
          addMessage("system", data.message || "Interview complete!");
          if (snapshotTimerRef.current) clearInterval(snapshotTimerRef.current);
          cleanupSpeech();
          return;
        }

        if (data.type === "evaluating") {
          setIsEvaluating(true);
          return;
        }

        if (data.type === "evaluated") {
          setIsEvaluating(false);
          if (data.runningScore != null) setRunningScore(data.runningScore);
          return;
        }

        if (data.type === "question" || data.question) {
          const qNum = data.questionNumber ?? questionNumberRef.current + 1;
          setQuestionNumber(qNum);
          questionNumberRef.current = qNum;
          questionStartTimeRef.current = Date.now();
          setIsEvaluating(false);
          if (data.maxQuestions) setMaxQuestions(data.maxQuestions);
          if (data.minQuestions) setMinQuestions(data.minQuestions);
          addMessage("ai", data.question || "");
          if (data.audio_base64) playAudio(data.audio_base64);
        }
      } catch {
        const text = event.data as string;
        addMessage("system", text);
        if (text.includes("Interview complete")) {
          setInterviewEnded(true);
          setStarted(false);
          if (snapshotTimerRef.current) clearInterval(snapshotTimerRef.current);
        }
      }
    };

    return () => {
      socket.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (snapshotTimerRef.current) clearInterval(snapshotTimerRef.current);
      cleanupSpeech();
    };
  }, [addMessage]);

  const handleStartInterview = async () => {
    if (!jobId || !userId) {
      addMessage("system", "Missing job or user information.");
      return;
    }

    setLoading(true);
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
      addMessage("system", "Starting interview session...");
      socket.current?.send(combined);

      await captureAndUploadSnapshot();
      snapshotTimerRef.current = setInterval(
        captureAndUploadSnapshot,
        SNAPSHOT_INTERVAL_MS
      );
    } catch {
      addMessage("system", "Failed to fetch resume or job description.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent =
    questionNumber > 0
      ? Math.min(100, Math.round((questionNumber / maxQuestions) * 100))
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="gradient-text text-2xl font-bold md:text-3xl">AI Interview Session</h1>
          <p className="mt-1 text-sm text-slate-400">
            Adaptive interview — questions follow your answers until the AI has enough signal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                socketReady
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {socketReady ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {socketReady ? "Connected" : "Connecting..."}
            </span>
            {started && !interviewEnded && runningScore != null && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
                Quality: {runningScore.toFixed(1)}/10
              </span>
            )}
            {started && !interviewEnded && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
                <Camera className="w-3.5 h-3.5" />
                {snapshotCount} snapshots
              </span>
            )}
        </div>
      </div>

      {started && !interviewEnded && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">
                Question {questionNumber || 1} · Adaptive ({minQuestions}–{maxQuestions} questions)
              </span>
              {isEvaluating ? (
                <span className="text-amber-300 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Evaluating answer...
                </span>
              ) : (
                <span className="text-cyan-300">{progressPercent}% depth</span>
              )}
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.max(progressPercent, started ? 8 : 0)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }}
              />
              {isListening && (
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/80 text-xs font-medium animate-pulse">
                  <Mic className="w-3.5 h-3.5" />
                  Listening...
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-4 text-center text-sm text-amber-200">
                  {cameraError}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 text-center">
              Periodic snapshots are captured for interview review (every 30s).
            </p>
          </div>

          <div className="lg:col-span-3 flex flex-col min-h-[500px] bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh] lg:max-h-none">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 py-12">
                  Click Start Interview when you are ready.
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : msg.role === "ai"
                          ? "bg-slate-800 text-slate-100 border border-slate-600 rounded-bl-md"
                          : "bg-slate-800/50 text-slate-400 text-center w-full max-w-full text-xs"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <span className="block text-xs text-cyan-400 mb-1 font-medium">
                        Interviewer
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 p-4 space-y-3 bg-slate-950/50">
              {!started && !interviewEnded && (
                <button
                  onClick={handleStartInterview}
                  disabled={!socketReady || loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Interview
                    </>
                  )}
                </button>
              )}

              {interviewEnded && (
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    Interview completed
                    {finalScore != null && (
                      <span className="ml-2 text-white font-semibold">Score: {finalScore}/100</span>
                    )}
                  </div>
                  {endReason && (
                    <p className="text-sm text-slate-400">{endReason}</p>
                  )}
                  <button
                    onClick={() => router.push(`/jobs/${jobId}`)}
                    className="self-start px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium"
                  >
                    Back to Job
                  </button>
                </div>
              )}

              {started && !interviewEnded && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer(input)}
                    placeholder="Type your answer or use voice..."
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={() => submitAnswer(input)}
                    disabled={!input.trim()}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      <audio ref={audioRef} hidden />
    </div>
  );
}
