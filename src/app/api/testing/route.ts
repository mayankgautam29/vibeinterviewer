import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel"
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest){
    await connect();
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error: "User not found"},{status: 404})
    }
    const interview = await Interview.create({
        userId,
        jobId: "6878fda8deb6d8a06753d6f0",
        interviewSummary: "Nothing",
        interviewScore: 50
    })
    await interview.save();
    return NextResponse.json({message: "hello"})
}