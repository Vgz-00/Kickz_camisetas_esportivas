import { z } from "zod";

export const avaliacaoSchema = z.object({
  camisaId: z.number().int(),
  nota: z.number().min(1).max(5),
  comentario: z.string().max(300).optional(),
});

export const respostaAdminSchema = z.object({
  resposta: z.string().min(1, "A resposta não pode ser vazia"),
});

export type AvaliacaoSchema = z.infer<typeof avaliacaoSchema>;
export type RespostaAdminSchema = z.infer<typeof respostaAdminSchema>;
