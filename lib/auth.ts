import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  let profile = await db.userProfile.findUnique({
    where: { clerkUserId: userId },
  });

  if (!profile) {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) return null;

    profile = await db.userProfile.create({
      data: {
        clerkUserId: userId,
        email: user.primaryEmailAddress.emailAddress,
        username: user.username || user.firstName || "donezo-user",
      },
    });
  }

  return profile;
}
