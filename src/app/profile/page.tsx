import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function ProfileRedirectPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  redirect(`/operator/${user.id}`);
}
