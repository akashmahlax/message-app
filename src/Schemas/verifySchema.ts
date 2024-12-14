import {z} from "zod"

export const verifySchema = z.object({
    //verify code
    verifycode: z
    .string()
    .min(6, {message: "verify code must be at least 6 characters"}),
    
    //email
    email: z
    .string()
    .email({message: "invalid email address"}),
})