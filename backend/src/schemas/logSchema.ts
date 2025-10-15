import { z } from "zod";
import { PadraoLogs } from "@prisma/client";

export const logSchema = z.object({
    clienteId: z.string().optional(),
    adminId: z.string().optional(),
    descricao: z.string().optional(),
    status: z.nativeEnum(PadraoLogs)
})

export type LogInput = z.infer<typeof logSchema>