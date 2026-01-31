import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const user = await currentUser();

  // Serialize user data to plain object for client component
  const userData = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    : null;

  return <NavbarClient user={userData} />;
}
