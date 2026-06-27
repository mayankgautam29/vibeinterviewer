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
import { GradientButton } from "@/components/ui/gradient-button";

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
    <div className="-mx-4 space-y-6 sm:-mx-6 lg:-mx-8">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label mb-2">Live session</p>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Interview
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Answer by voice or text. Questions adapt to your responses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 py-1">
            {socketReady ? <Wifi className="h-3.5 w-3.5 text-emerald-500" /> : <WifiOff className="h-3.5 w-3.5" />}
            {socketReady ? "Connected" : "Connecting"}
          </span>
          {started && !interviewEnded && runningScore != null && (
            <span className="rounded-md border border-zinc-800 px-2.5 py-1">
              Avg {runningScore.toFixed(1)}/10
            </span>
          )}
          {started && !interviewEnded && (
            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-800 px-2.5 py-1">
              <Camera className="h-3.5 w-3.5" />
              {snapshotCount} saved
            </span>
          )}
        </div>
      </div>

      {started && !interviewEnded && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>
              Question {questionNumber || 1} · {minQuestions}–{maxQuestions} expected
            </span>
            {isEvaluating ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Evaluating
              </span>
            ) : null}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-zinc-400 transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, started ? 6 : 0)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-md border border-zinc-800 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {isListening && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-zinc-950/90 px-2.5 py-1 text-xs text-zinc-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Recording
              </div>
            )}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 p-4 text-center text-sm text-zinc-400">
                {cameraError}
              </div>
            )}
          </div>
          <p className="text-center text-xs text-zinc-600">
            Session snapshots saved every 30 seconds for review.
          </p>
        </div>

        <div className="flex min-h-[480px] flex-col overflow-hidden rounded-md border border-zinc-800 lg:col-span-3">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="py-16 text-center text-sm text-zinc-600">
                Press start when you&apos;re ready.
              </p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
                {msg.role === "system" ? (
                  <p className="text-center text-xs text-zinc-600">{msg.text}</p>
                ) : (
                  <div
                    className={`inline-block max-w-[90%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-100 text-zinc-950"
                        : "border border-zinc-800 bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        Interviewer
                      </span>
                    )}
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 p-4">
            {!started && !interviewEnded && (
              <GradientButton
                onClick={handleStartInterview}
                disabled={!socketReady || loading}
                loading={loading}
                fullWidth
              >
                {!loading && <Mic className="h-4 w-4" />}
                Start interview
              </GradientButton>
            )}

            {interviewEnded && (
              <div className="space-y-3 rounded-md border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Session complete
                  {finalScore != null && (
                    <span className="text-zinc-500">· Score {finalScore}/100</span>
                  )}
                </div>
                {endReason && <p className="text-xs text-zinc-500">{endReason}</p>}
                <GradientButton variant="secondary" size="sm" onClick={() => router.push(`/jobs/${jobId}`)}>
                  Back to job
                </GradientButton>
              </div>
            )}

            {started && !interviewEnded && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitAnswer(input)}
                  placeholder="Type your answer…"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => submitAnswer(input)}
                  disabled={!input.trim()}
                  className="rounded-md border border-zinc-700 px-3 text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
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
