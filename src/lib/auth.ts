import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    // Development & Local Credentials Provider
    CredentialsProvider({
      id: "terminal-credentials",
      name: "Terminal Handshake",
      credentials: {
        email: { label: "Operator Email", type: "email", placeholder: "operator@sudoupdate.dev" },
        role: { label: "Role Clearance", type: "text", placeholder: "root or operator" },
      },
      async authorize(credentials) {
        const email = (credentials?.email || "operator@sudoupdate.dev").toLowerCase().trim();
        const adminEmail = (process.env.ADMIN_EMAIL || "root@sudoupdate.dev").toLowerCase().trim();
        const isRoot = email === adminEmail || credentials?.role === "root" || credentials?.role === "admin";

        const fallbackUser = {
          id: isRoot ? "cuid_root_admin_001" : "cuid_field_operator_002",
          name: isRoot ? "root_operator" : "field_operator",
          email,
          isAdmin: isRoot,
          image: isRoot
            ? "https://avatars.githubusercontent.com/u/9919?s=200&v=4"
            : "https://avatars.githubusercontent.com/u/583231?s=200&v=4",
        };

        try {
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: fallbackUser.name,
                isAdmin: isRoot,
                image: fallbackUser.image,
              },
            });
          } else if (isRoot && !user.isAdmin) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { isAdmin: true },
            });
          }
          return user;
        } catch (dbError) {
          // Graceful fallback for local dev when external database is not yet connected
          console.warn("[AUTH_DEV_MODE] Database unavailable, using in-memory dev session:", dbError);
          return fallbackUser;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim() || "root@sudoupdate.dev";
        const userEmail = user.email?.toLowerCase().trim();
        const isDesignatedAdmin = Boolean(adminEmail && userEmail && userEmail === adminEmail);

        if (isDesignatedAdmin && !user.isAdmin) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { isAdmin: true },
            });
          } catch {
            // Safe ignore if DB is offline
          }
          token.isAdmin = true;
        } else {
          token.isAdmin = Boolean(user.isAdmin || isDesignatedAdmin);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "sudo_update_dev_secret_development_only_super_secure_32_chars",
};
