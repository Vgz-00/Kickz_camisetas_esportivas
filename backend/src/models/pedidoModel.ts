import { prisma } from "../db"
import { PedidoInput } from "../schemas/pedidoSchema"

export const pedidoModel = {
  
  create: (data: PedidoInput) => prisma.pedido.create({data, include: { cliente: true, itens: true } }),
  
  listAll: () => prisma.pedido.findMany({ include: { cliente: true, itens: true } })
  
}