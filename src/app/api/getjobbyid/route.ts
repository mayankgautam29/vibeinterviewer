import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "Job ID not found" }, { status: 500 });
    }
    const job = await Job.findById(jobId)
      .populate("jobByUser", "username profileImg")
      .populate("applicants", "username profileImg");
    return NextResponse.json({ job: job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
