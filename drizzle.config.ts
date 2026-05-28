import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // Tolerated at config import time so commands like `--help` work without env;
  // actual db operations will fail clearly downstream.
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
} satisfies Config;
