import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'

type ClienteStore = {
    cliente: ClienteType
    logaCliente: (clienteLogado: ClienteType) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => {
  const clienteStr = localStorage.getItem("clienteKey")
  let clienteInicial: ClienteType = {} as ClienteType

  try {
    if (clienteStr) {
      clienteInicial = JSON.parse(clienteStr) as ClienteType
    }
  } catch {
    clienteInicial = {} as ClienteType
  }

  return {
    cliente: clienteInicial,
    logaCliente: (clienteLogado) => {
      set({ cliente: clienteLogado })
      localStorage.setItem("clienteKey", JSON.stringify(clienteLogado))
    },
    deslogaCliente: () => {
      set({ cliente: {} as ClienteType })
      localStorage.removeItem("clienteKey")
    }
  }
})