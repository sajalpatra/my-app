
// import { PrismaClient } from "@prisma/client/extension";
import { PrismaClient } from "../app/generated/prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
export const db= global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = db;

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const db =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log: ["query", "error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
