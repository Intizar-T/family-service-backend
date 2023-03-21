/*
  Warnings:

  - You are about to drop the column `boughtUserId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdUserId` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdUserName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isBought" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdUserName" TEXT NOT NULL,
    "boughtUserName" TEXT,
    CONSTRAINT "Product_createdUserName_fkey" FOREIGN KEY ("createdUserName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_boughtUserName_fkey" FOREIGN KEY ("boughtUserName") REFERENCES "User" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("createdAt", "id", "isBought", "name", "updatedAt") SELECT "createdAt", "id", "isBought", "name", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_User" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "nickName" TEXT
);
INSERT INTO "new_User" ("name", "nickName") SELECT "name", "nickName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
