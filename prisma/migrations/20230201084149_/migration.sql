/*
  Warnings:

  - You are about to drop the `_product_on_pos_saleTosale_exchange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" DROP CONSTRAINT "_product_on_pos_saleTosale_exchange_A_fkey";

-- DropForeignKey
ALTER TABLE "_product_on_pos_saleTosale_exchange" DROP CONSTRAINT "_product_on_pos_saleTosale_exchange_B_fkey";

-- DropTable
DROP TABLE "_product_on_pos_saleTosale_exchange";
