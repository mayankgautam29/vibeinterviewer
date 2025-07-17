import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/models/jobModel";


export async function POST(request: NextRequest){
    try {
        await connect();
        const {userId} = await auth();
        const { jobtitle, jobdescription, company} = await request.json();
        if(!jobdescription || !jobtitle || !company){
            return NextResponse.json({error: "Unsatified requirements"},{status: 400})
        }
        const user = await User.findOne({userId})
        const newJob = await Job.create({
            company,
            jobdescription,
            jobtitle,
            jobByUser: user._id
        })
        return NextResponse.json({ success: true, job: newJob });
    } catch (error:any) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}