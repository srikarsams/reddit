import { PrismaClient } from '@prisma/client';

let db: PrismaClient;
const env = process.env.NODE_ENV;

declare global {
  var __db: PrismaClient | undefined;
}

if (env === 'production') {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
