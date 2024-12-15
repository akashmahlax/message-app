import { NextAuthOptions, Session, User } from "next-auth"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import UserModel from "@/models/user"
import Dbconnect from "@/app/lib/dbconnect"
import CredentialsProvider from "next-auth/providers/credentials"
import { pages } from "next/dist/build/templates/app-page"
import { JWT } from "next-auth/jwt"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
       async authorize(credentials): Promise<User | null> {
        await Dbconnect();
        try {
            const user = await UserModel.findOne({
                $or: [
                    {email : credentials?.Email},
                    {username : credentials?.username}
                ]
            })
            if(!user){
                throw new Error("no user found")
                return null;
            }
            if(!user.isverified){
                throw new Error("please verify yourself first")
            }
            const isValid = await bcrypt.compare(credentials?.password as string, user.password);
            return isValid ? user : null;
        } catch (error) {
            console.log(error);
            return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: Session, user: User, token: JWT }) {
        session.user = token as User;
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isverified = token.isverified;
        return session;
      },
      async jwt({ token, user }:  { token: JWT, user: User }) {
        if(user){
            token.id = user._id;
            token.username = user.username;
            token.email = user.email as string;
            token.isverified = user.isverified;
        }
        return token
      }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)