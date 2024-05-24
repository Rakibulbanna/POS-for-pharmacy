-- AlterTable
ALTER TABLE "products_on_pos_sales" ALTER COLUMN "quantity" DROP DEFAULT,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;
