import { connect } from "@/dbconfig/dbconfig";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    jobId: { type: String, required: true },
    screenshots: [
      {
        data: String,
        timestamp: String,
        questionNumber: Number,
      },
    ],
  },
  { timestamps: true }
);

const InterviewSnapshot =
  mongoose.models.InterviewSnapshot ||
  mongoose.model("InterviewSnapshot", snapshotSchema);

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { userId: authUserId } = await auth();
    const body = await request.json();
    const { jobId, imageBase64, questionNumber } = body;

    if (!authUserId || !jobId || !imageBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const screenshotEntry = {
      data: imageBase64,
      timestamp: new Date().toISOString(),
      questionNumber: questionNumber ?? 0,
    };

    await InterviewSnapshot.findOneAndUpdate(
      { userId: authUserId, jobId },
      {
        $push: {
          screenshots: {
            $each: [screenshotEntry],
            $slice: -20,
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connect();
    const jobId = request.nextUrl.searchParams.get("jobId");
    const userId = request.nextUrl.searchParams.get("userId");

    if (!jobId || !userId) {
      return NextResponse.json({ error: "Missing jobId or userId" }, { status: 400 });
    }

    const snapshot = await InterviewSnapshot.findOne({ userId, jobId });
    return NextResponse.json({ screenshots: snapshot?.screenshots ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
