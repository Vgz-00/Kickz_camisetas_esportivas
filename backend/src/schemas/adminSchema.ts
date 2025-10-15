import { z } from "zod";

export const adminSchema = z.object({
  nome: z.string().min(4, {
    message: "Nome deve ter no mínimo 3 caracteres",
  }),
  senha: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
  nivel: z.number().min(1, {message: "Nivel, no minimo, 1"}).max(5, {message: "Nivel, no maximo, 5"}),
  email: z.string().email({message: "Formato de email inválido"}),
})

export type AdminInput = z.infer<typeof adminSchema>

