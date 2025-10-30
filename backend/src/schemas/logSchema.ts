import { z } from "zod";


export const logSchema = z.object({
    clienteId: z.string().optional(),
    adminId: z.string().optional(),
    descricao: z.string().optional(),
    
})

export type LogInput = z.infer<typeof logSchema>