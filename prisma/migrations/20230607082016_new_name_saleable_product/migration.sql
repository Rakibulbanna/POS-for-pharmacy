/*
  Warnings:

  - You are about to drop the `vendor_wise_purchase_received` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vendor_wise_purchase_received" DROP CONSTRAINT "vendor_wise_purchase_received_product_id_fkey";

-- DropForeignKey
ALTER TABLE "vendor_wise_purchase_received" DROP CONSTRAINT "vendor_wise_purchase_received_vendor_id_fkey";

-- DropTable
DROP TABLE "vendor_wise_purchase_received";

-- CreateTable
CREATE TABLE "saleable_products" (
    "id" SERIAL NOT NULL,
    "no_of_product" DOUBLE PRECISION NOT NULL,
    "no_of_bonus_product" DOUBLE PRECISION,
    "sale_barcode" TEXT NOT NULL,
    "sale_count" DOUBLE PRECISION NOT NULL,
    "product_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saleable_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saleable_products" ADD CONSTRAINT "saleable_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleable_products" ADD CONSTRAINT "saleable_products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
