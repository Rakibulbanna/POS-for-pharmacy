-- CreateTable
CREATE TABLE "price_changes" (
    "id" SERIAL NOT NULL,
    "old_mrp_price" DOUBLE PRECISION NOT NULL,
    "new_mrp_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "price_changes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "price_changes" ADD CONSTRAINT "price_changes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
