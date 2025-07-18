import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { interviewId, status } = await request.json();

    if (!interviewId || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await Interview.findByIdAndUpdate(interviewId, { status });
    return NextResponse.json({ success: true });
  } catch (error:any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
