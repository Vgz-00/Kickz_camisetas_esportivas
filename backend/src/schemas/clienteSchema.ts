import { z } from "zod";
import { validaSenha } from "../utils/validaSenha";

export const clienteSchema = z.object({
  nome: z.string().min(4, {
    message: "Nome deve ter no mínimo 3 caracteres",
  }),
  senha: z.string().min(8, {
    message: "Senha deve ter no mínimo 8 caracteres",
  }).refine((senha) => validaSenha(senha).isValid, {
    message: "Deve conter maiusculas, minusculas, numeros e simbolos"
  }),
  email: z.string().email({message: "Formato de email inválido"}),
});

export const loginSchema = z.object({
  email: z.string().email({message: "Formato de email inválido"}),
  senha: z.string().min(8, {
    message: "Senha deve ter no mínimo 8 caracteres",
  }) 
})


export type ClienteInput = z.infer<typeof clienteSchema>
export type LoginInput = z.infer<typeof loginSchema>
