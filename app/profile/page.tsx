import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Profile Settings
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
