/*
  Warnings:

  - You are about to drop the `_pos_sale_returnToproduct_on_pos_sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_pos_sale_returnToproduct_on_pos_sale" DROP CONSTRAINT "_pos_sale_returnToproduct_on_pos_sale_A_fkey";

-- DropForeignKey
ALTER TABLE "_pos_sale_returnToproduct_on_pos_sale" DROP CONSTRAINT "_pos_sale_returnToproduct_on_pos_sale_B_fkey";

-- DropTable
DROP TABLE "_pos_sale_returnToproduct_on_pos_sale";
