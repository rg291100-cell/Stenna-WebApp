/*
  Warnings:

  - You are about to drop the column `moq` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "specs" TEXT,
    "images" TEXT NOT NULL,
    "videos" TEXT,
    "category" TEXT NOT NULL,
    "weight" TEXT,
    "material" TEXT,
    "rollLength" TEXT,
    "rollWidth" TEXT,
    "designStyle" TEXT,
    "room" TEXT,
    "color" TEXT,
    "theme" TEXT,
    "collectionId" TEXT,
    CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "collectionId", "color", "description", "id", "images", "material", "name", "price", "room", "sku", "specs", "theme", "weight") SELECT "category", "collectionId", "color", "description", "id", "images", "material", "name", "price", "room", "sku", "specs", "theme", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
