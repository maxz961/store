import { PrismaClient } from "@prisma/client";

// Ensure pgbouncer=true is set for Supabase transaction pooler (port 6543)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes('pgbouncer=true')) {
  const sep = dbUrl.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${dbUrl}${sep}pgbouncer=true`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
