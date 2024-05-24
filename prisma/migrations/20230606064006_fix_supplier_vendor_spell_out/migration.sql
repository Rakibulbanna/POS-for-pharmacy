/*
  Warnings:

  - You are about to drop the column `is_vender` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "is_vender",
ADD COLUMN     "is_vendor" BOOLEAN NOT NULL DEFAULT false;
