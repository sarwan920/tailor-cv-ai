-- CreateTable
CREATE TABLE "CvProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TailoredCv" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "tailoredContent" TEXT NOT NULL,
    "aiAnalysis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TailoredCv_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CvProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
