-- CreateTable
CREATE TABLE "_product_on_pos_saleTosale_exchange" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_pos_sale_returnToproduct_on_pos_sale" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_product_on_pos_saleTosale_exchange_AB_unique" ON "_product_on_pos_saleTosale_exchange"("A", "B");

-- CreateIndex
CREATE INDEX "_product_on_pos_saleTosale_exchange_B_index" ON "_product_on_pos_saleTosale_exchange"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pos_sale_returnToproduct_on_pos_sale_AB_unique" ON "_pos_sale_returnToproduct_on_pos_sale"("A", "B");

-- CreateIndex
CREATE INDEX "_pos_sale_returnToproduct_on_pos_sale_B_index" ON "_pos_sale_returnToproduct_on_pos_sale"("B");

-- AddForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" ADD CONSTRAINT "_product_on_pos_saleTosale_exchange_A_fkey" FOREIGN KEY ("A") REFERENCES "products_on_pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" ADD CONSTRAINT "_product_on_pos_saleTosale_exchange_B_fkey" FOREIGN KEY ("B") REFERENCES "sale_exchanges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pos_sale_returnToproduct_on_pos_sale" ADD CONSTRAINT "_pos_sale_returnToproduct_on_pos_sale_A_fkey" FOREIGN KEY ("A") REFERENCES "pos_sale_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pos_sale_returnToproduct_on_pos_sale" ADD CONSTRAINT "_pos_sale_returnToproduct_on_pos_sale_B_fkey" FOREIGN KEY ("B") REFERENCES "products_on_pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
