import { z } from "zod";

export const itensPedidoSchema = z.object({
    pedidoId: z.number().int(),
    camisaId: z.number().int(),
    quantidade: z.number().min(1),
    preco: z.number()
})

export type ItensPedidoInput = z.infer<typeof itensPedidoSchema>