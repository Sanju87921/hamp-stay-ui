import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(`[next-auth][error][${code}]`, ...message);
    },
    warn(code, ...message) {
      console.warn(`[next-auth][warn][${code}]`, ...message);
    },
    debug(code, ...message) {
      console.log(`[next-auth][debug][${code}]`, ...message);
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin-x7k");

      // Admin route protection
      if (isOnAdmin) {
        if (isLoggedIn && role === "SUPER_ADMIN") return true;
        return Response.redirect(new URL("/login", nextUrl));
      }

      // Dashboard protection (shared by all roles)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.badges = user.badges || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.badges = (token.badges as string[]) || [];
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
