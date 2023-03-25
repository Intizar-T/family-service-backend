/*
  Warnings:

  - You are about to drop the column `createdUserName` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userDevice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Product` table without a default value. This is not possible if the table is not empty.

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
    "userDevice" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "boughtUserDevice" TEXT,
    "boughtUserName" TEXT,
    CONSTRAINT "Product_userDevice_userName_fkey" FOREIGN KEY ("userDevice", "userName") REFERENCES "User" ("device", "name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_boughtUserDevice_boughtUserName_fkey" FOREIGN KEY ("boughtUserDevice", "boughtUserName") REFERENCES "User" ("device", "name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("amount", "boughtUserName", "createdAt", "id", "isBought", "name", "updatedAt") SELECT "amount", "boughtUserName", "createdAt", "id", "isBought", "name", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_User" (
    "device" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("device", "name")
);
INSERT INTO "new_User" ("device", "name") SELECT "device", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
