/*
  Warnings:

  - Added the required column `no_of_bonus_product` to the `vendor_wise_purchase_received` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vendor_wise_purchase_received" ADD COLUMN     "no_of_bonus_product" DOUBLE PRECISION NOT NULL;
