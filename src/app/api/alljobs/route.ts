import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel"; // ✅ must be imported before Job
import Job from "@/models/jobModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const allJobs = await Job.find({})
      .populate("jobByUser", "username profileImg")
      .populate("applicants", "username profileImg");

    return NextResponse.json({ jobs: allJobs });
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}