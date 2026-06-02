import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const rawUrl = process.env.DATABASE_URL;
const dbUrl = (rawUrl && rawUrl !== 'undefined') ? rawUrl : 'file:./prisma/dev.db';

console.log(`[Database Init] Connecting to database URL: ${dbUrl}`);

const config = {
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
};

const adapter = new PrismaLibSql(config);

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // Bind to globalThis in development to prevent HMR connection exhaustion
  const globalRef = globalThis as unknown as { prisma?: PrismaClient };
  if (!globalRef.prisma) {
    globalRef.prisma = new PrismaClient({ adapter });
  }
  prisma = globalRef.prisma;
}

export { prisma };
