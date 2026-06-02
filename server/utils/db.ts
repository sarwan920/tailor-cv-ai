import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

const config = {
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
};

const libsql = createClient(config);
const adapter = new PrismaLibSql(libsql);

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
