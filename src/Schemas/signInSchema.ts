import {z} from "zod"

export const signInSchema = z.object({
    //email
    email: z
    .string()
    .email({message: "invalid email address"}),
    //password
    password: z
    .string()
    .min(8, {message: "password must be at least 8 characters"}),
})