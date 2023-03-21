/*
  Warnings:

  - Made the column `updatedAt` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isBought" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdUserId" INTEGER NOT NULL,
    "boughtUserId" INTEGER,
    CONSTRAINT "Product_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_boughtUserId_fkey" FOREIGN KEY ("boughtUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("boughtUserId", "createdAt", "createdUserId", "id", "isBought", "name", "updatedAt") SELECT "boughtUserId", coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "createdUserId", "id", "isBought", "name", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
