// db.server.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Prevent multiple instances of Prisma Client in development
declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({
    log: ["query", "error", "warn"]
  });
}

prisma = global.__db;

export { prisma };
