import Dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/models/user";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// Define types
interface ApiResponse {
  message: string;
  success: boolean;
}

// Define validation schema
const verifyCodeSchema = z.object({
  username: z.string().min(1),
  code: z.string().length(6) // Assuming it's a 6-digit code
});

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = verifyCodeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        message: "Invalid input data",
        success: false
      }, { status: 400 });
    }

    const { username, code } = validationResult.data;
    const decodedUsername = decodeURIComponent(username);

    // Find user
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json<ApiResponse>({
        message: "User not found",
        success: false
      }, { status: 404 });
    }

    // Verify code
    if (!user.verificationCode) {
      return NextResponse.json<ApiResponse>({
        message: "No verification code exists",
        success: false
      }, { status: 400 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json<ApiResponse>({
        message: "Invalid verification code",
        success: false
      }, { status: 400 });
    }

    // Check code expiration
    if (!user.verificationCodeExpiry || user.verificationCodeExpiry < new Date()) {
      return NextResponse.json<ApiResponse>({
        message: "Verification code has expired",
        success: false
      }, { status: 400 });
    }

    // Update user
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    return NextResponse.json<ApiResponse>({
      message: "Code verified successfully",
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error("Error in verifying code:", error);
    return NextResponse.json<ApiResponse>({
      message: "Internal server error",
      success: false
    }, { status: 500 });
  }
}