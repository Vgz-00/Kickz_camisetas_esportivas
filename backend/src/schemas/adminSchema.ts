import { z } from "zod";

export const adminSchema = z.object({
  nome: z.string().min(4, { message: "Nome deve ter no mínimo 4 caracteres" }),
  senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  nivel: z.number().min(1).max(5),
  email: z.string().email({ message: "Formato de e-mail inválido" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido" }),
  senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

export type AdminInput = z.infer<typeof adminSchema>;
export type AdminLoginInput = z.infer<typeof loginSchema>;
