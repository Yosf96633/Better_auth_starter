import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>() , twoFactorClient({
    onTwoFactorRedirect : ()=>{
      window.location.href = '/auth/2fa'
    }
  })],
});
