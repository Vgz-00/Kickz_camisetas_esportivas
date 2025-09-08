import { z } from "zod";
import { PadraoLogs } from "@prisma/client";

export const logSchema = z.object({
    clienteId: z.number().int().positive().optional(),
    adminId: z.number().int().positive().optional(),
    descricao: z.string().optional(),
    status: z.nativeEnum(PadraoLogs)
})

export type LogInput = z.infer<typeof logSchema>