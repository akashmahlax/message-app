import {z} from "zod"
  //user verifications
export const signUpSchema = z.object({
    username: z
    .string()
    .min(3, {message: "username must be at least 3 characters"})
    .max(20, {message: "username must be at most 20 characters"})
    .regex(/^[a-zA-Z0-9]+$/, {message: "username must contain only letters and numbers"})
    .refine((value) => !value.includes(" "), {message: "username must not contain spaces"}),

    //email verifiaction
    email: z.string()
    .email({message: "invalid email address"}),

    //password verifiaction
    password: z.string()
    .min(8, {message: "password must be at least 8 characters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"})
  });


