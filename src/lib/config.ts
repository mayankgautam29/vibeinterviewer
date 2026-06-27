export const config = {
  wsUrl:
    process.env.NEXT_PUBLIC_WS_URL ||
    "wss://vibeinterviewer-backend1.onrender.com/ws",
  indexingUrl:
    process.env.NEXT_PUBLIC_INDEXING_URL ||
    "https://vibeinterviewer-backend1-1.onrender.com/indexing",
  interviewApiUrl:
    process.env.NEXT_PUBLIC_INTERVIEW_API_URL ||
    "https://vibeinterviewer-backend1.onrender.com",
};
