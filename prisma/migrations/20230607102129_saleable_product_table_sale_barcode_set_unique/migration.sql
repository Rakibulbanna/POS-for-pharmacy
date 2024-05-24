/*
  Warnings:

  - A unique constraint covering the columns `[sale_barcode]` on the table `saleable_products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "saleable_products_sale_barcode_key" ON "saleable_products"("sale_barcode");
