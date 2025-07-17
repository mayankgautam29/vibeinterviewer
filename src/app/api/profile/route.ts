import { auth } from "@clerk/nextjs/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 500 });
    }
    return NextResponse.json({ user: user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
