import { StatusPedido } from "@prisma/client";
import { z } from "zod";

export const pedidoSchema = z.object({
    clienteId: z.number().int(),
   

});

export const pedidoUpdateSchema = z.object({
    status: z.nativeEnum(StatusPedido)
}).partial();

export type PedidoInput = z.infer<typeof pedidoSchema>
export type PedidoUpdateInput = z.infer<typeof pedidoUpdateSchema>
