/*
  Warnings:

  - You are about to alter the column `amount` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isBought" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdUserName" TEXT NOT NULL,
    "boughtUserName" TEXT,
    CONSTRAINT "Product_createdUserName_fkey" FOREIGN KEY ("createdUserName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_boughtUserName_fkey" FOREIGN KEY ("boughtUserName") REFERENCES "User" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("amount", "boughtUserName", "createdAt", "createdUserName", "id", "isBought", "name", "updatedAt") SELECT "amount", "boughtUserName", "createdAt", "createdUserName", "id", "isBought", "name", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
