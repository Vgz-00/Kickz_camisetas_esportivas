import { z } from "zod";

export const pedidoSchema = z.object({
    clienteId: z.number().int()
})

export type PedidoInput = z.infer<typeof pedidoSchema>