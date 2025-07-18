import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { jobId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ error: "Invalid jobId format" }, { status: 400 });
    }
    const interview = await Interview.findOne({
      userId: userId,
      jobId: jobId,
    });

    if (!interview || interview==="") {
      return NextResponse.json({ message: null });
    }

    return NextResponse.json({ message: interview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
