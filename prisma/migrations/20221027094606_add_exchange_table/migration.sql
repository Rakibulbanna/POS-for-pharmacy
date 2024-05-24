-- CreateTable
CREATE TABLE "sale_exchanges" (
    "id" SERIAL NOT NULL,
    "origin_sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exchanging_sale_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_exchanges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sale_exchanges" ADD CONSTRAINT "sale_exchanges_origin_sale_id_fkey" FOREIGN KEY ("origin_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_exchanges" ADD CONSTRAINT "sale_exchanges_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_exchanges" ADD CONSTRAINT "sale_exchanges_exchanging_sale_id_fkey" FOREIGN KEY ("exchanging_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
