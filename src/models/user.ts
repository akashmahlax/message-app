import mongoose, { Document, Schema } from "mongoose";

export interface MESSAGE extends Document {
  content: string;
  date: Date;
}

const messageSchema = new Schema<MESSAGE>({
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

export interface USER extends Document {
  username: string;
  password: string;
  email: string;
  verifycode:string;
  verifycodeexpiry:Date;
  isverified:boolean,
  isAcceptingMessages:boolean,
  messages: MESSAGE[];
}

const userSchema = new Schema<USER>({
  username: { type: String, required: [true, " useername is required"], trim:true, unique:true },
  email: { type: String, required: [true, " email is required"], trim:true, unique:true },
  password: { type: String, required: [true, " password is required"],  },
  verifycode:{type:String,required:true},
  verifycodeexpiry:{type:Date,required:true},
  isAcceptingMessages:{type:Boolean,default:true},
  messages: [messageSchema],
});

const UserModel = mongoose.models.User || mongoose.model<USER>("User", userSchema);
export default UserModel;
