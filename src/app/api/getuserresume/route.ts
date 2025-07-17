import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest){
    try {
        await connect();
        const {userId} = await auth();
        const user = await User.findOne({userId});
        if(!user){
            return NextResponse.json({error: "User not found"},{status: 404})
        }
        return NextResponse.json({summary: user.resume})
    } catch (error:any) {
        return NextResponse.json({error: error.message},{status:500})
    }
}