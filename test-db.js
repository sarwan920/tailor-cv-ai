import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, './dev.db');

console.log("Database absolute path:", dbPath);
console.log("Initializing PrismaClient with absolute path...");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching CV profiles...");
  const profiles = await prisma.cvProfile.findMany();
  console.log("Profiles found successfully:", profiles);
}

main()
  .catch((e) => {
    console.error("Error running test:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
