import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  let dbUser = await db.user.findFirst({
    where: {
      clerkUserId: user.id,
    },
  });
  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "no email",
        imageUrl: user.imageUrl || "",
        name: `${user.firstName} ${user.lastName}` || "no name",
      },
    });
  }
  return dbUser;
};
