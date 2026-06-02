import { PrismaClient } from '@prisma/client';
import path from 'path';

let prisma: PrismaClient;

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // Production / Turso Cloud
  const { createClient } = require('@libsql/client');
  const { PrismaLibSQL } = require('@prisma/adapter-libsql');

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  // Local SQLite development (uses native better-sqlite3)
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const dbPath = path.resolve(process.cwd(), './dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

  // In development, bind the client to globalThis to prevent multiple instances during HMR
  const globalRef = globalThis as unknown as { prisma?: PrismaClient };
  if (!globalRef.prisma) {
    globalRef.prisma = new PrismaClient({ adapter });
  }
  prisma = globalRef.prisma;
}

export { prisma };
