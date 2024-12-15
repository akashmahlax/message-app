// src/app/api/send-messages/route.ts
import Dbconnect from "@/app/lib/dbconnect";
import MessageModel from "@/models/message";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { messageSchema } from "@/Schemas/messageSchema";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = messageSchema.parse(body);
    const { message, recipient } = validatedData;

    // Create new message in database
    const newMessage = await MessageModel.create({
      message,
      recipient,
      createdAt: new Date(),
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: newMessage
      },
      { status: 201 }
    );

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}