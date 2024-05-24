/*
  Warnings:

  - Added the required column `stock_ledger_id` to the `stock_ledgers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_ledgers" ADD COLUMN     "stock_ledger_id" INTEGER NOT NULL;
