-- CreateTable
CREATE TABLE "vendor_wise_purchase_received" (
    "id" SERIAL NOT NULL,
    "no_of_product" DOUBLE PRECISION NOT NULL,
    "sale_count" DOUBLE PRECISION NOT NULL,
    "product_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_wise_purchase_received_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vendor_wise_purchase_received" ADD CONSTRAINT "vendor_wise_purchase_received_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_wise_purchase_received" ADD CONSTRAINT "vendor_wise_purchase_received_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
