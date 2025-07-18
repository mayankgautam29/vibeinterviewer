import { connect } from "@/dbconfig/dbconfig";
import Job from "@/models/jobModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await connect();
    const {jobId} = await request.json();
    const {userId} = await auth();
    if(!jobId || !userId){
        return NextResponse.json({owner: false})
    }
    const user = await User.findOne({userId})
    const job = await Job.findById(jobId);
    if(!user || !job){
        return NextResponse.json({owner: false})
    }

    if(user._id.equals(job.jobByUser)){
        return NextResponse.json({owner: true})
    } else{
        return NextResponse.json({owner: false})
    }
}