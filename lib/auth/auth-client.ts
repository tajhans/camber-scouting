import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: process.env.BASE_URL,
});
