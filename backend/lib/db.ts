/**
 * lib/db.ts — THE SINGLE SOURCE OF TRUTH FOR DATABASE ACCESS
 *
 * Prisma 7 requires a driver adapter. All database operations
 * go through this file. To switch databases (local → Neon → Render):
 *   1. Change DATABASE_URL in .env
 *   2. That's it — no other code changes needed.
 */

import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
