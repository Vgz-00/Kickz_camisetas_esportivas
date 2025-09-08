import { prisma } from "../db"
import { ItensPedidoInput } from "../schemas/itemPedidoSchema"

export const itensPedidoModel = {
  
  create: (data: ItensPedidoInput) => prisma.itensPedido.create({ data }),
  
  listAll: () => prisma.itensPedido.findMany({ include: { pedido: true } }),
  
  uptade: (id: number, data: Partial<ItensPedidoInput>) =>
          prisma.itensPedido.update({where: { id }, data}), 
      
  delete: (id: number) => prisma.itensPedido.delete({ where: { id } }),
}