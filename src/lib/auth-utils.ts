import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const userEmail = user.email?.toLowerCase().trim();

  // Validate via boolean flag or explicit admin email match
  return Boolean(user.isAdmin || (adminEmail && userEmail === adminEmail));
}
