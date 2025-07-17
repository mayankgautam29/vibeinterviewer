import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        await connect();
        const {jobId} = await request.json();
        const job = await Job.findById(jobId);
        if(!job){
            return NextResponse.json({error: "Job not found!"},{status: 404})
        }
        return NextResponse.json({desc: job.jobdescription})
    } catch (error:any) {
        return NextResponse.json({error: error.message},{status:500})
    }
}