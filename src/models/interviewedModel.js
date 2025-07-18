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
  }
});
const Interview =
  mongoose.models.Interview || mongoose.model("Interview", interviewModel);
export default Interview;
