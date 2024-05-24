/*
  Warnings:

  - You are about to drop the column `cost_value` on the `stock_ledgers` table. All the data in the column will be lost.
  - You are about to drop the column `sale_value` on the `stock_ledgers` table. All the data in the column will be lost.
  - Added the required column `cost_price` to the `stock_ledgers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrp_price` to the `stock_ledgers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_ledgers" DROP COLUMN "cost_value",
DROP COLUMN "sale_value",
ADD COLUMN     "cost_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mrp_price" DOUBLE PRECISION NOT NULL;
