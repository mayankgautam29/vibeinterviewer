import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ msg: "Job ID is missing" }, { status: 400 });
    }

    const interview = await Interview.findOne({ jobId });

    if (!interview) {
      return NextResponse.json({ user: null, interview: null });
    }

    const usr = interview.userId;
    const userdata = await User.findOne({ userId: usr });

    return NextResponse.json({ user: userdata, interview });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
