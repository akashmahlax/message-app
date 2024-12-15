// src/app/api/send-messages/route.ts
import Dbconnect from "@/app/lib/dbconnect";
import MessageModel from "@/models/message";
import { NextRequest, NextResponse } from "next/server";
import UserModel, { MESSAGE } from "@/models/user";
import { z } from "zod";
import mongoose from "mongoose";
// Input validation schema
const messageRequestSchema = z.object({
  content: z.string().min(1).max(1000),
  username: z.string().min(1),
});

type MessageRequest = z.infer<typeof messageRequestSchema>;

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await Dbconnect();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = messageRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { content, username } = validatedData.data;

    // Find user
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user accepts messages
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    // Create and save message in a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newMessage = new MessageModel({
        content,
        createdAt: new Date(),
        sender: user._id,
      });

      user.messages.push(newMessage as MESSAGE);
      
      await Promise.all([
        user.save({ session }),
        newMessage.save({ session }),
      ]);

      await session.commitTransaction();
      
      return NextResponse.json(
        {
          success: true,
          message: "Message sent successfully",
          data: {
            messageId: newMessage._id,
            createdAt: newMessage.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error in POST /api/send-messages:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}