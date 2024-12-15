import Dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/models/user";
import { z } from "zod";
import { usernameSchema } from "@/Schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

// Define response types for better type safety
type ApiResponse = {
  message: string;
  success?: boolean;
};

/**
 * Checks if a username is unique in the database
 * @param req - Next.js API request
 * @returns JSON response indicating if username is available or error message
 */
export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Extract and validate username from query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json<ApiResponse>(
        { message: "Username is required", success: false },
        { status: 400 }
      );
    }

    // Validate username format using Zod
    const validationResult = usernameSchema.safeParse(username);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid username format";
      return NextResponse.json<ApiResponse>(
        { message: errorMessage, success: false },
        { status: 400 }
      );
    }

    // Check if username exists in database
    const existingUser = await UserModel.findOne({ username }).lean();

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { message: "Username already exists", success: false },
        { status: 400 }
      );
    }

    // Return success response if username is available
    return NextResponse.json<ApiResponse>(
      { message: "Username is available", success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in check-username-unique:", error);
    return NextResponse.json<ApiResponse>(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}