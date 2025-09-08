import {Categoria } from "@prisma/client";
import { z } from "zod";

export const camisaSchema = z.object ({
    modelo: z.string().max(30),
    preco: z.number(),
    foto: z.string(),
    categoria: z.nativeEnum(Categoria),
    destaque: z.boolean().optional(),
    marcaId: z.number().int()  

}) 

export type CamisaInput = z.infer<typeof camisaSchema>