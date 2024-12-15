import resend from "../lib/resend";
import  VerificationEmail  from "../../../emails/verificationEmail";
import { ApiResponce } from "../../../types/ApiResponce"; // Fixed typo in "Response"

export async function sendVerificationEmail(
    email: string, 
    username: string, 
    otp: string
): Promise<ApiResponce> {
    try {
        await resend.emails.send({
            from: "noreply@chatapp.com",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({ username, otp }) // Added space after comma
        });
        
        return { 
            success: true, 
            message: "Verification email sent successfully"
        };
    } catch (error) { // More generic error name
        console.error("Email sending error:", error); // Better error logging
        return { 
            success: false,
            message: "Failed to send verification email"
        };
    }
}