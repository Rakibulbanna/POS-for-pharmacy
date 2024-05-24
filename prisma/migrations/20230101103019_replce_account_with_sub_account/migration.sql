/*
  Warnings:

  - You are about to drop the column `account_id` on the `vouchers` table. All the data in the column will be lost.
  - Added the required column `sub_account_id` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_account_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "batch_no" TEXT;

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "account_id",
ADD COLUMN     "payment_note" TEXT,
ADD COLUMN     "sub_account_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_sub_account_id_fkey" FOREIGN KEY ("sub_account_id") REFERENCES "sub_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
