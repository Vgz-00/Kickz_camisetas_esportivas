import { z } from "zod";
import { validaSenha } from "../utils/validaSenha";

export const clienteSchema = z.object({
  nome: z.string().min(4, { message: "Nome deve ter no mínimo 4 caracteres" }),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
    .refine((senha) => validaSenha(senha).isValid, {
      message: "Deve conter maiúsculas, minúsculas, números e símbolos",
    }),
  email: z.string().email({ message: "Formato de e-mail inválido" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido" }),
  senha: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type ClienteLoginInput = z.infer<typeof loginSchema>;
