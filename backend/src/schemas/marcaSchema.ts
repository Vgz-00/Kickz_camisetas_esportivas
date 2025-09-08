import { z } from "zod";


export const marcaSchema = z.object({
    nome: z.string(),
    foto: z.string(),
    
})

export type MarcaInput = z.infer<typeof marcaSchema>