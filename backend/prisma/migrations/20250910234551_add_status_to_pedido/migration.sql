-- AlterTable
ALTER TABLE "public"."pedidos" ADD COLUMN     "status" "public"."StatusPedido" NOT NULL DEFAULT 'PENDENTE';
