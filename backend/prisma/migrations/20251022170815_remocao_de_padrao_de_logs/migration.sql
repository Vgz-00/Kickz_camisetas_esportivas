/*
  Warnings:

  - You are about to drop the column `status` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Log" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."PadraoLogs";
