/*
  Warnings:

  - The primary key for the `pos_sales` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "pos_payments" DROP CONSTRAINT "pos_payments_pos_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "pos_sale_returns" DROP CONSTRAINT "pos_sale_returns_pos_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "products_on_pos_sales" DROP CONSTRAINT "products_on_pos_sales_pos_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_exchanges" DROP CONSTRAINT "sale_exchanges_exchanging_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_exchanges" DROP CONSTRAINT "sale_exchanges_origin_sale_id_fkey";

-- AlterTable
ALTER TABLE "pos_payments" ALTER COLUMN "pos_sale_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pos_sale_returns" ALTER COLUMN "pos_sale_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pos_sales" DROP CONSTRAINT "pos_sales_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pos_sales_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pos_sales_id_seq";

-- AlterTable
ALTER TABLE "products_on_pos_sales" ALTER COLUMN "pos_sale_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sale_exchanges" ALTER COLUMN "origin_sale_id" SET DATA TYPE TEXT,
ALTER COLUMN "exchanging_sale_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "products_on_pos_sales" ADD CONSTRAINT "products_on_pos_sales_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_payments" ADD CONSTRAINT "pos_payments_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_exchanges" ADD CONSTRAINT "sale_exchanges_origin_sale_id_fkey" FOREIGN KEY ("origin_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_exchanges" ADD CONSTRAINT "sale_exchanges_exchanging_sale_id_fkey" FOREIGN KEY ("exchanging_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sale_returns" ADD CONSTRAINT "pos_sale_returns_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
