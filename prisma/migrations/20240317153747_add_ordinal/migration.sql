-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Issue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" INTEGER NOT NULL,
    "ordinal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Issue_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "IssueState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Issue" ("createdAt", "createdById", "description", "id", "name", "projectId", "severity", "stateId", "updatedAt") SELECT "createdAt", "createdById", "description", "id", "name", "projectId", "severity", "stateId", "updatedAt" FROM "Issue";
DROP TABLE "Issue";
ALTER TABLE "new_Issue" RENAME TO "Issue";
CREATE INDEX "Issue_projectId_idx" ON "Issue"("projectId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
