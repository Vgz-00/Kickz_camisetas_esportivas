/*
  Warnings:

  - You are about to drop the `interacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."interacao" DROP CONSTRAINT "interacao_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."interacao" DROP CONSTRAINT "interacao_camisaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."interacao" DROP CONSTRAINT "interacao_clienteId_fkey";

-- DropTable
DROP TABLE "public"."interacao";

-- DropEnum
DROP TYPE "public"."InteracaoTipo";

-- DropEnum
DROP TYPE "public"."StatusInteracao";

-- CreateTable
CREATE TABLE "public"."avaliacoes" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "camisaId" INTEGER NOT NULL,
    "nota" INTEGER,
    "comentario" TEXT,
    "resposta" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."avaliacoes" ADD CONSTRAINT "avaliacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes" ADD CONSTRAINT "avaliacoes_camisaId_fkey" FOREIGN KEY ("camisaId") REFERENCES "public"."camisas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
