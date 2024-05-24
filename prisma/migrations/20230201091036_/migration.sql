-- CreateTable
CREATE TABLE "_product_on_pos_saleTosale_exchange" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_product_on_pos_saleTosale_exchange_AB_unique" ON "_product_on_pos_saleTosale_exchange"("A", "B");

-- CreateIndex
CREATE INDEX "_product_on_pos_saleTosale_exchange_B_index" ON "_product_on_pos_saleTosale_exchange"("B");

-- AddForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" ADD CONSTRAINT "_product_on_pos_saleTosale_exchange_A_fkey" FOREIGN KEY ("A") REFERENCES "products_on_pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" ADD CONSTRAINT "_product_on_pos_saleTosale_exchange_B_fkey" FOREIGN KEY ("B") REFERENCES "sale_exchanges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
