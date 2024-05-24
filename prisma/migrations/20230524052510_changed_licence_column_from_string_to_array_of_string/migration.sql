/*
  Warnings:

  - The `licence_key` column on the `settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "licence_key",
ADD COLUMN     "licence_key" TEXT[] DEFAULT ARRAY[]::TEXT[];
