import { connect } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewedModel";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest){
    await connect();
    const {jobId} = await request.json();
    if(!jobId){
        return NextResponse.json({msg: "Job not found"})
    }
    const inter = await Interview.findOne({jobId})
    console.log(inter)
    const usr = inter.userId;
    console.log(usr)
    const userdata = await User.findOne({userId: usr})
    console.log(userdata)
    return NextResponse.json({user: userdata,interview: inter})
}
