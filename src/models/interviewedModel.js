import mongoose, { Schema } from "mongoose";
const interviewModel = new Schema({
  userId: {
    type: String,
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  interviewSummary: {
    type: String,
  },
  interviewScore: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  screenshots: [
    {
      data: String,
      timestamp: String,
      questionNumber: Number,
    },
  ],
  integrityNotes: { type: String },
  cheatingFlags: [{ type: String }],
  questionCount: { type: Number },
});
const Interview =
  mongoose.models.Interview || mongoose.model("Interview", interviewModel);
export default Interview;
