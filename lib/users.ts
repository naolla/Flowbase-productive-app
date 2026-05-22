import { currentUser } from "@clerk/nextjs/server";
import { db, users } from "@/db";

export async function syncCurrentUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses.at(0)?.emailAddress;

  if (!email) {
    return null;
  }

  const name =
    user.fullName ??
    [user.firstName, user.lastName].filter(Boolean).join(" ") ??
    null;

  const [savedUser] = await db
    .insert(users)
    .values({
      clerkId: user.id,
      email,
      name: name || null,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        name: name || null,
      },
    })
    .returning();

  return savedUser;
}
