/*
  Warnings:

  - You are about to drop the column `created_at` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "created_at";

-- CreateTable
CREATE TABLE "stock_ledgers" (
    "id" SERIAL NOT NULL,
    "previous_stock" INTEGER NOT NULL,
    "current_stock" INTEGER NOT NULL,
    "cost_value" DOUBLE PRECISION NOT NULL,
    "sale_value" DOUBLE PRECISION NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_ledgers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_ledgers" ADD CONSTRAINT "stock_ledgers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
