import { z } from "zod";
import { StatusPedido } from "@prisma/client";
import { itensPedidoSchema } from "./itemPedidoSchema";

export const pedidoSchema = z.object({
  itens: z.array(itensPedidoSchema).min(1, "O pedido deve ter ao menos um item."),
});

export const pedidoUpdateSchema = z.object({
  status: z.nativeEnum(StatusPedido),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;
export type PedidoUpdateInput = z.infer<typeof pedidoUpdateSchema>;
