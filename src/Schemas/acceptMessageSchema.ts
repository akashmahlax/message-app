import {z} from "zod"

export const acceptMessageSchema = z.object({
    //message
    message: z
    .boolean()
    .refine((value) => value === true, {message: "message must be true"}),
    
    //email
    email: z
    .string()
    .email({message: "invalid email address"}),
})