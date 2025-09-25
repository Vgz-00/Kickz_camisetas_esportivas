import type { CamisaType } from "./CamisaType"

export type ItemPedidoType = {
  id: number
  camisaId: number
  camisa: CamisaType
  quantidade: number
  preco: number
}

export type PedidoType = {
  id: number
  clienteId: number
  createdAt: string
  status: string
  itens: ItemPedidoType[]
}
