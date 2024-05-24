/*
  Warnings:

  - You are about to drop the column `remainint_amount` on the `customer_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer_payments" DROP COLUMN "remainint_amount",
ADD COLUMN     "remaining_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;
