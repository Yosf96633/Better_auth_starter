import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/auth-schema";
import { sendEmailVerification, sendPasswordReset } from "./emails/email";
import { toast } from "sonner";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },

      dateOfBirth: {
        type: "date",
        required: false,
      },

      gender: {
        type: "string",
        required: false,
        enum: ["male", "female", "other"],
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const { success, data } = await sendPasswordReset({ user, url });
        if (!success) {
          console.log("Error in auth.ts sendPasswordReset function : ", data);
          toast.error(`Error while sending Reset password email!`);
        }
      } catch (error) {
        console.log(
          "Error in auth.ts sendPasswordReset function in catch block : ",
          error,
        );
        toast.error(`Error while  sending Reset password email!`);
      }
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const { success, data } = await sendEmailVerification({ user, url });
        if (!success) {
          console.log(
            "Error in auth.ts sendVerificationEmail function : ",
            data,
          );
          toast.error(`Error while sending verification email!`);
        }
      } catch (error) {
        console.log(
          "Error in auth.ts sendVerificationEmail function in catch block : ",
          error,
        );
        toast.error(`Error while sending verification email!`);
      }
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 mintues
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies(), twoFactor(), passkey()],
});
