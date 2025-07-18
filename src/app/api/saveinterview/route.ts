import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { jobId, userId } = await request.json();
    if (!jobId || !userId) {
      return NextResponse.json({ error: "User or job not found" }, { status: 404 });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.applicants.includes(userId)) {
      return NextResponse.json({ message: "Already applied" });
    }
    job.applicants.push(userId);
    await job.save();

    return NextResponse.json({ message: "Application submitted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
