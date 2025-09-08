import { prisma } from "../db"
import { MarcaInput } from "../schemas/marcaSchema"

export const marcaModel = {

  create: (data: MarcaInput) => prisma.marca.create({ data }),
  
  listAll: () => prisma.marca.findMany({ include: { camisa: true } }),
  
  uptade: (id: number, data: Partial<MarcaInput>) =>
        prisma.marca.update({where: { id }, data}), 
    
  delete: (id: number) => prisma.marca.delete({ where: { id } }),

}