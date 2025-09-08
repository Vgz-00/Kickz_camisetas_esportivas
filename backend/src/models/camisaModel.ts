import { prisma } from "../db";
import { CamisaInput } from "../schemas/camisaSchema";

export const camisaModel = {

    create: (data: CamisaInput) => prisma.camisa.create({data}),
 
    listAll: () => prisma.camisa.findMany({include: {marca: true}}),  
    
    uptade: (id: number, data: Partial<CamisaInput>) =>
        prisma.camisa.update({where: { id }, data}), 
    
    delete: (id: number) => prisma.camisa.delete({ where: { id } }),
} 
