
import { prisma } from "../db";
import { ClienteInput } from "../schemas/clienteSchema";

export const clienteModel = {

    create: (data: ClienteInput) => prisma.cliente.create({data}),

    listAll: () => prisma.cliente.findMany(),  
    
    findByEmail: (email: string) =>
        prisma.cliente.findUnique({
            where: {email}
            
        })
} 
