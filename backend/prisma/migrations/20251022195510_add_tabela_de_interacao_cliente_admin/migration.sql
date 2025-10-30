/*
  Warnings:

  - You are about to drop the `InteracaoCliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."InteracaoCliente" DROP CONSTRAINT "InteracaoCliente_camisaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InteracaoCliente" DROP CONSTRAINT "InteracaoCliente_clienteId_fkey";

-- DropTable
DROP TABLE "public"."InteracaoCliente";

-- CreateTable
CREATE TABLE "public"."interacao" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "adminId" VARCHAR(36),
    "camisaId" INTEGER NOT NULL,
    "tipo" "public"."InteracaoTipo" NOT NULL,
    "status" "public"."StatusInteracao" NOT NULL DEFAULT 'ABERTO',
    "mensagem" TEXT,
    "nota" INTEGER,
    "respostaAdmin" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."interacao" ADD CONSTRAINT "interacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interacao" ADD CONSTRAINT "interacao_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interacao" ADD CONSTRAINT "interacao_camisaId_fkey" FOREIGN KEY ("camisaId") REFERENCES "public"."camisas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
