import Dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// Input validation schema
const acceptMessagesSchema = z.object({
  acceptMessages: z.boolean()
});

// Helper function to check authentication
const authenticateUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user as User & { _id: string };
};

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Authenticate user
    const user = await authenticateUser();

    // Validate input
    const body = await request.json();
    const { acceptMessages } = acceptMessagesSchema.parse(body);

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isAcceptingMessage: updatedUser.isAcceptingMessage
    });

  } catch (error) {
    console.error('Error in POST /api/accept-messages:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Authenticate user
    const user = await authenticateUser();

    // Find user
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isAcceptingMessage: foundUser.isAcceptingMessage
    });

  } catch (error) {
    console.error('Error in GET /api/accept-messages:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}