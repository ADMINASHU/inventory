import { NextResponse } from "next/server";
import  User  from "../../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function PUT(request) {
  const {
  
    fName,
    eName,
    image,
    address ,
    region,
    branch,
    mobileNo,
    email,
    level,
    verified,
  } = await request.json();

  try {
    await connectToServiceEaseDB();

    const user = await User.findOneAndUpdate(
      { email }, // Find user by email
      {
        $set: {
          fName,
          eName,
          image,
          address,
          region,
          branch,
          mobileNo,
          email,
          level,
          verified, // Reset verified to false on edit
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const { email } = await request.json();
    // console.log("From profile/ post : " + userID);
    await connectToServiceEaseDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function GET(request) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}