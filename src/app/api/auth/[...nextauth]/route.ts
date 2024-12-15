import NextAuth from "next-auth"
import { authOptions } from "./options"

// Create and export the authentication handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }