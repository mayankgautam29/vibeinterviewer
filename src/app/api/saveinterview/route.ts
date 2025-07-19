import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { jobId, userId } = await request.json();

    if (!jobId || !userId) {
      return NextResponse.json({ error: "Missing jobId or userId" }, { status: 400 });
    }
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: userId } },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User added to applicants array" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
