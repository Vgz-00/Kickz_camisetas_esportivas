import { z } from "zod";

export const itensPedidoSchema = z.object({
  camisaId: z.number().int(),
  quantidade: z.number().min(1),
  preco: z.number().positive(),
});

export type ItensPedidoInput = z.infer<typeof itensPedidoSchema>;
