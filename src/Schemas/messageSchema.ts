import {z } from "zod"

export const messageSchema = z.object({
    id: z.string(),
    content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
    createdAt: z.date(),
    sender: z.string(),
    receiver: z.string(),
})

export type Message = z.infer<typeof messageSchema>
