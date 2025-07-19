import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { jobId, userId } = await request.json();

    if (!jobId || !userId) {
      return NextResponse.json({ error: "Missing jobId or userId" }, { status: 400 });
    }
    const newInterview = await Interview.create({
      jobId,
      userId,
      status: "pending",
    });

    return NextResponse.json({ message: "Interview saved", interview: newInterview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
