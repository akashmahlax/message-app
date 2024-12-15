import { z } from "zod";
//user verifications
export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9]+$/)
  .refine((value) => !value.includes(" "), {
    message: "username must not contain spaces",
  });

export const signUpSchema = z.object({
  username: usernameSchema,

  //email verifiaction
  email: z.string().email({ message: "invalid email address" }),

  //password verifiaction
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});
