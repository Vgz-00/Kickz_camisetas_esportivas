/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `senha` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - The primary key for the `clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `senha` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.

*/
-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedidos" DROP CONSTRAINT "pedidos_clienteId_fkey";

-- DropIndex
DROP INDEX "public"."admins_email_key";

-- DropIndex
DROP INDEX "public"."clientes_email_key";

-- AlterTable
ALTER TABLE "public"."Log" ALTER COLUMN "clienteId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "adminId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."admins" DROP CONSTRAINT "admins_pkey",
ADD COLUMN     "nivel" SMALLINT NOT NULL DEFAULT 2,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(60),
ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "admins_id_seq";

-- AlterTable
ALTER TABLE "public"."camisas" ADD COLUMN     "adminId" VARCHAR(36);

-- AlterTable
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(60),
ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "clientes_id_seq";

-- AlterTable
ALTER TABLE "public"."pedidos" ADD COLUMN     "adminId" VARCHAR(36),
ALTER COLUMN "clienteId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."camisas" ADD CONSTRAINT "camisas_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
