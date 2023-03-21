-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isBought" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "createdUserId" INTEGER NOT NULL,
    "boughtUserId" INTEGER NOT NULL,
    CONSTRAINT "Product_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_boughtUserId_fkey" FOREIGN KEY ("boughtUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
