-- CreateEnum
CREATE TYPE "public"."StatusInteracao" AS ENUM ('ABERTO', 'RESPONDIDO', 'FECHADO');

-- CreateEnum
CREATE TYPE "public"."InteracaoTipo" AS ENUM ('AVALIACAO', 'PERGUNTA');

-- CreateTable
CREATE TABLE "public"."InteracaoCliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "camisaId" INTEGER NOT NULL,
    "tipo" "public"."InteracaoTipo" NOT NULL,
    "status" "public"."StatusInteracao" NOT NULL,
    "mensagem" TEXT,
    "nota" INTEGER,
    "respostaAdmin" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteracaoCliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."InteracaoCliente" ADD CONSTRAINT "InteracaoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InteracaoCliente" ADD CONSTRAINT "InteracaoCliente_camisaId_fkey" FOREIGN KEY ("camisaId") REFERENCES "public"."camisas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
