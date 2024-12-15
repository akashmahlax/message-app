import Dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/models/user";
import MessageModel from "@/models/message";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { messageSchema, type Message } from "@/Schemas/messageSchema";

const querySchema = z.object({
  limit: z.string().optional().transform(val => parseInt(val || '50')),
  offset: z.string().optional().transform(val => parseInt(val || '0')),
});

export async function GET(request: NextRequest) {
  try {
    await Dbconnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user: User = session.user;

    const url = new URL(request.url);
    const validated = querySchema.safeParse({
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
    });

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { limit, offset } = validated.data;

    // Using aggregation pipeline
    const [result] = await MessageModel.aggregate([
      // Match messages where user is either sender or receiver
      {
        $match: {
          $or: [
            { sender: user.email },
            { receiver: user.email }
          ]
        }
      },
      // Sort by creation date
      {
        $sort: { createdAt: -1 }
      },
      // Facet to get both messages and total count in one query
      {
        $facet: {
          messages: [
            { $skip: offset },
            { $limit: limit },
            // Project to match our schema
            {
              $project: {
                id: { $toString: "$_id" },
                content: 1,
                createdAt: 1,
                sender: 1,
                receiver: 1,
                _id: 0
              }
            }
          ],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ]);

    const messages = result.messages;
    const total = result.totalCount[0]?.count || 0;

    // Validate messages against schema
    const validatedMessages = messages.map(msg => messageSchema.parse(msg));

    return NextResponse.json({
      messages: validatedMessages,
      pagination: {
        total,
        offset,
        limit,
      }
    });

  } catch (error) {
    console.error("Error in GET /api/get-messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}