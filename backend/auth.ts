import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";

if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "[next-auth][error] Missing NEXTAUTH_SECRET environment variable. PKCE cookies will fail to parse. Set NEXTAUTH_SECRET in production."
  );
  throw new Error(
    "Missing NEXTAUTH_SECRET environment variable. See .env or deployment settings."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email: email as string },
        });

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.passwordHash
        );

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
});
