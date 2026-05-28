import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

let prisma: PrismaClient;

const dbPath = path.resolve(process.cwd(), './dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // In development, bind the client to globalThis to prevent multiple instances during HMR
  const globalRef = globalThis as unknown as { prisma?: PrismaClient };
  if (!globalRef.prisma) {
    globalRef.prisma = new PrismaClient({ adapter });
  }
  prisma = globalRef.prisma;
}

export { prisma };
