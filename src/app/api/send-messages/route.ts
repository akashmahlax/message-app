// src/app/api/send-messages/route.ts
import Dbconnect from "@/app/lib/dbconnect";
import MessageModel from "@/models/message";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { messageSchema } from "@/Schemas/messageSchema";
import UserModel, { MESSAGE } from "@/models/user";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    const {content, content} = await request.json();
    try {
        const user = await UserModel.findOne({username:username})
        if (!user) {
            return NextResponse.json(
                {
                    success:false,
                    error:"User not found"
                },
                {status:404})
        }
        //is user is accepting message
        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                {
                    success:false,
                    error:"User is not accepting messages"
                },
                {status:400})
        }
        const newMessage = new MessageModel({
            content,
            createdAt:new Date(),
            sender:user._id,
            
        })
        user.messages.push(newMessage as MESSAGE)
        await user.save()
        await newMessage.save()
        return NextResponse.json(
            {
                success:true,
                message:"Message sent successfully"
            },
            {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success:false,
                error:"Internal server error"
            },
            {status:500})
    }
}