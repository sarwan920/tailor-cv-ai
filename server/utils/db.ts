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

async function initializeDatabase(client: PrismaClient) {
  try {
    // Sequentially create database tables if they do not exist
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `);

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" DATETIME NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token");
    `);

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CvProfile" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
      );
    `);

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TailoredCv" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "profileId" TEXT NOT NULL,
        "jobTitle" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "jobDescription" TEXT NOT NULL,
        "originalContent" TEXT NOT NULL,
        "tailoredContent" TEXT NOT NULL,
        "aiAnalysis" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("profileId") REFERENCES "CvProfile" ("id") ON DELETE CASCADE
      );
    `);
    console.log("[Database Init] SQLite schema tables verified and synced successfully.");
  } catch (error) {
    console.error("[Database Init] Error running auto-migration schema init:", error);
  }
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
  initializeDatabase(prisma);
} else {
  // Bind to globalThis in development to prevent HMR connection exhaustion
  const globalRef = globalThis as unknown as { prisma?: PrismaClient };
  if (!globalRef.prisma) {
    globalRef.prisma = new PrismaClient({ adapter });
    initializeDatabase(globalRef.prisma);
  }
  prisma = globalRef.prisma;
}

export { prisma };
