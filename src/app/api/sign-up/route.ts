import Dbconnect from "@/app/lib/dbconnect";
import UserModel, { MESSAGE } from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail  } from "@/app/helpers/sendverficationEmail"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await Dbconnect()
    try {
        const {username, email, password} = await req.json();
        const existingUser = await UserModel.findOne({username:username});
        if(existingUser){
            return NextResponse.json({message:"User already exists with this username", success:false}, {status: 400});
        }
        const existingUserbyEmail = await UserModel.findOne({email:email});
        if(existingUserbyEmail){
            if(existingUserbyEmail.isverified){
                return NextResponse.json({message:"User already exists with this email", success:false}, {status: 400});
            }
            else{
               const hashedPassword = await bcrypt.hash(password, 10);
               existingUserbyEmail.password = hashedPassword;
               existingUserbyEmail.verifycode = Math.floor(100000 + Math.random() * 900000).toString();
               existingUserbyEmail.verifycodeexpiry = new Date(Date.now() + 3600000);
               await existingUserbyEmail.save();
               return NextResponse.json({message:"User already exists with this email", success:false}, {status: 400});
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifycodeexpiry = new Date(Date.now() + 10 * 60 * 1000);
        const isverified = false;
        const isAcceptingMessages = true;
        const messages: MESSAGE[] = [];
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            verifycode,
            verifycodeexpiry:verifycodeexpiry.toISOString(),
            isverified:false,
            isAcceptingMessages:true,
            messages:messages
        });
        await newUser.save();
        
        await sendVerificationEmail(email, username, newUser._id);
        
        return NextResponse.json({message:"User created successfully", success:true}, {status:201});
    } catch (error) {
        console.log("Error in signup",error) 
        return NextResponse.json(
            {
                message:"Error in signup",success:false}, {status:500

                }
            )
    }
}

