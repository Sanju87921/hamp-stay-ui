// prisma.config.ts — Prisma 7 configuration
// ─────────────────────────────────────────────────────────────
// DATABASE_URL is the ONLY value that changes when you switch
// from local PostgreSQL → Neon → Render.
// Everything else stays exactly the same.
// ─────────────────────────────────────────────────────────────
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
