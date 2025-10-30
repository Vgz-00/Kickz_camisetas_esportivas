import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'

type ClienteStore = {
  cliente: ClienteType
  logaCliente: (clienteLogado: ClienteType) => void
  deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => {
  // O clienteKey agora é lido como JSON puro (sem btoa/atob)
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
      // CORRIGIDO: O token já é salvo no Login.tsx.
      // Remover esta linha impede a sobrescrita do token real por uma string vazia.
      localStorage.setItem("clienteKey", JSON.stringify(clienteLogado))
    },
    deslogaCliente: () => {
      set({ cliente: {} as ClienteType })
      localStorage.removeItem("clienteKey")
      localStorage.removeItem("token")
    }
  }
})
