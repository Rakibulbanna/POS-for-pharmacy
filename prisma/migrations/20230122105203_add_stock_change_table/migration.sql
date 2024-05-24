-- CreateTable
CREATE TABLE "stock_changes" (
    "id" SERIAL NOT NULL,
    "old_stock" DOUBLE PRECISION NOT NULL,
    "new_stock" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "stock_changes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_changes" ADD CONSTRAINT "stock_changes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
