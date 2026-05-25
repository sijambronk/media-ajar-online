import { prisma } from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Gunakan globalThis agar nilai acak hanya dibuat satu kali (singleton) per proses Node.js
const globalForAuth = global as unknown as { authSecret?: string };
if (typeof window === "undefined" && !globalForAuth.authSecret) {
  globalForAuth.authSecret = crypto.randomBytes(32).toString("hex");
}
const dynamicSecret = typeof window === "undefined"
  ? globalForAuth.authSecret
  : "static_dev_secret_2026";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Pass role to token
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NODE_ENV === "production" ? dynamicSecret : (process.env.NEXTAUTH_SECRET || "static_dev_secret_2026"),
};
