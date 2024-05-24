-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "can_give_discount" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maximum_discount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "role" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "floor_id" INTEGER NOT NULL,
    "vat_in_percent" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "discount_in_percent" DOUBLE PRECISION NOT NULL DEFAULT 0.00,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "company_name" TEXT NOT NULL,
    "address" TEXT,
    "phone_number" TEXT,
    "email_address" TEXT,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_modes" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,

    CONSTRAINT "payment_modes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "zone_id" INTEGER,
    "vat_in_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "system_barcode" TEXT NOT NULL,
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "style_size" TEXT,
    "color_id" INTEGER,
    "product_barcode" TEXT,
    "minimum_order_quantity" INTEGER,
    "maximum_order_quantity" INTEGER,
    "re_order_quantity" INTEGER,
    "whole_sale_price" DOUBLE PRECISION,
    "product_expiry_date" TIMESTAMP(3),
    "batch_expiry_date" TIMESTAMP(3),
    "cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "MRP_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "brand_id" INTEGER,
    "supplier_id" INTEGER,
    "is_service" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "backup_product_barcode" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_received" BOOLEAN NOT NULL DEFAULT false,
    "received_at" TIMESTAMP(3),
    "additional_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_returns" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mrp_price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_purchase_order" (
    "cost_price" DOUBLE PRECISION NOT NULL,
    "mrp_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER,
    "received_quantity" INTEGER,
    "bonus_quantity" INTEGER,
    "wholesale_price" DOUBLE PRECISION,
    "product_id" INTEGER NOT NULL,
    "purchase_order_id" INTEGER NOT NULL,

    CONSTRAINT "product_on_purchase_order_pkey" PRIMARY KEY ("product_id","purchase_order_id")
);

-- CreateTable
CREATE TABLE "pos_sales" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sub_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vat_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paid_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "return_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "customer_id" INTEGER,

    CONSTRAINT "pos_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_on_pos_sales" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "pos_sale_id" INTEGER NOT NULL,
    "product_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "sale_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mrp_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "offer_type" TEXT,
    "offer_id" INTEGER,

    CONSTRAINT "products_on_pos_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_payments" (
    "id" SERIAL NOT NULL,
    "pos_sale_id" INTEGER NOT NULL,
    "method" INTEGER NOT NULL,
    "via" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pos_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "membership_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "customer_id" TEXT NOT NULL,
    "membership_type_id" INTEGER,
    "point" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit_limit" INTEGER NOT NULL DEFAULT 0,
    "credit_spend" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damage_and_lost" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "damage_and_lost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_sale_returns" (
    "id" SERIAL NOT NULL,
    "pos_sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "return_amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "pos_sale_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "type" INTEGER NOT NULL,
    "discount_in_percent" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_promotion" (
    "id" SERIAL NOT NULL,
    "promotion_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "disc_in_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "disc_in_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "product_on_promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_promotions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flat_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_flat_promotion" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "flat_promotion_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "disc_in_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "disc_in_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "product_on_flat_promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buy_x_get_x" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buy_x_get_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_buy_x_get_x" (
    "id" SERIAL NOT NULL,
    "buy_x_get_x_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "product_on_buy_x_get_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_promotions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "barcode" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "combo_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_combo_promotion" (
    "combo_promotion_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "product_on_combo_promotion_pkey" PRIMARY KEY ("combo_promotion_id","product_id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL DEFAULT '',
    "including_vat" BOOLEAN NOT NULL,
    "company_address" TEXT NOT NULL DEFAULT '',
    "company_phone_number" TEXT NOT NULL DEFAULT '',
    "point_system" BOOLEAN NOT NULL DEFAULT false,
    "point_ratio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "redeem_ratio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "licence_key" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SupplierTopayment_mode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_title_key" ON "permissions"("title");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_value_key" ON "permissions"("value");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_system_barcode_key" ON "products"("system_barcode");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_number_key" ON "customers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_id_key" ON "customers"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUser_AB_unique" ON "_PermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SupplierTopayment_mode_AB_unique" ON "_SupplierTopayment_mode"("A", "B");

-- CreateIndex
CREATE INDEX "_SupplierTopayment_mode_B_index" ON "_SupplierTopayment_mode"("B");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_purchase_order" ADD CONSTRAINT "product_on_purchase_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_purchase_order" ADD CONSTRAINT "product_on_purchase_order_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sales" ADD CONSTRAINT "pos_sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sales" ADD CONSTRAINT "pos_sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_pos_sales" ADD CONSTRAINT "products_on_pos_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_on_pos_sales" ADD CONSTRAINT "products_on_pos_sales_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_payments" ADD CONSTRAINT "pos_payments_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_membership_type_id_fkey" FOREIGN KEY ("membership_type_id") REFERENCES "membership_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_and_lost" ADD CONSTRAINT "damage_and_lost_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sale_returns" ADD CONSTRAINT "pos_sale_returns_pos_sale_id_fkey" FOREIGN KEY ("pos_sale_id") REFERENCES "pos_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sale_returns" ADD CONSTRAINT "pos_sale_returns_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_promotion" ADD CONSTRAINT "product_on_promotion_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_flat_promotion" ADD CONSTRAINT "product_on_flat_promotion_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_flat_promotion" ADD CONSTRAINT "product_on_flat_promotion_flat_promotion_id_fkey" FOREIGN KEY ("flat_promotion_id") REFERENCES "flat_promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_buy_x_get_x" ADD CONSTRAINT "product_on_buy_x_get_x_buy_x_get_x_id_fkey" FOREIGN KEY ("buy_x_get_x_id") REFERENCES "buy_x_get_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_buy_x_get_x" ADD CONSTRAINT "product_on_buy_x_get_x_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_combo_promotion" ADD CONSTRAINT "product_on_combo_promotion_combo_promotion_id_fkey" FOREIGN KEY ("combo_promotion_id") REFERENCES "combo_promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_combo_promotion" ADD CONSTRAINT "product_on_combo_promotion_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierTopayment_mode" ADD CONSTRAINT "_SupplierTopayment_mode_A_fkey" FOREIGN KEY ("A") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierTopayment_mode" ADD CONSTRAINT "_SupplierTopayment_mode_B_fkey" FOREIGN KEY ("B") REFERENCES "payment_modes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
