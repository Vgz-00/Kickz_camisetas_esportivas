import { prisma } from "../db"
import { PedidoInput } from "../schemas/pedidoSchema"
import { Pedido, StatusPedido } from "@prisma/client"
export const pedidoModel = {
  
  create: (data: PedidoInput) => prisma.pedido.create({data, include: { cliente: true, itens: true } }),
  
  listAll: () => prisma.pedido.findMany({ include: { cliente: true, itens: true } }),

  updateStatus: (id: number, status: StatusPedido): Promise<Pedido> => prisma.pedido.update({
    where: { id },
    data: { status }
  }),
  
  findPendente: (clienteId: number) => prisma.pedido.findFirst({
    where: { 
      clienteId,
      status: 'PENDENTE' 
    },
    include: {
      itens: { include: { camisa: true } }
    }
  }),

  listByCliente: (clienteId: number) => prisma.pedido.findMany({
  where: { clienteId },
  include: {
    itens: { include: { camisa: true } },
    cliente: true,
  }
})
}