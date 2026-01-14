import { resend } from "@/lib/resend";
import EmailVerification from "./verification-email";

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
const COMPANY_NAME = process.env.COMPANY_NAME || "Better Auth Starter";

type IUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
};

interface SendEmailVerificationParams {
  user: IUser;
  url: string;
}

export async function sendEmailVerification({
  user,
  url,
}: SendEmailVerificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: "Confirm your email",
      react: (
        <EmailVerification 
          verificationLink={url} 
          userName={user.name} 
          companyName={COMPANY_NAME} 
        />
      ),
    });

    if (error) {
      console.error("❌ Failed to send verification email:", error);
      throw new Error(`Email send failed: ${error.message}`);
    }

    console.log(`✅ Verification email sent to ${user.email}`);
    console.log("Email ID:", data?.id);
    
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email verification error:", error);
    throw error; // Re-throw so Better Auth knows it failed
  }
}