-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IssueState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL DEFAULT 0,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "IssueState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IssueState" ("color", "id", "name", "projectId") SELECT "color", "id", "name", "projectId" FROM "IssueState";
DROP TABLE "IssueState";
ALTER TABLE "new_IssueState" RENAME TO "IssueState";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
