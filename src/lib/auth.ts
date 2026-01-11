import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js"
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/auth-schema"
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema : schema
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins:[
    nextCookies()
  ]
});
