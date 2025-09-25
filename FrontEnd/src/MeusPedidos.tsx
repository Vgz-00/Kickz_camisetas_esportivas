// MeusPedidos.tsx
import './MeusPedidos.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { PedidoType } from "./utils/PedidoType";
import { toast } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<PedidoType[]>([])
    const { cliente } = useClienteStore()

    
    async function buscaDados() {
        if (!cliente.id) return
        const response = await fetch(`${apiUrl}/pedidos/${cliente.id}`)
        const dados = await response.json()
        setPedidos(dados)
    }

    useEffect(() => {
        buscaDados()
    }, [cliente.id])

   
    function dataDMA(data: string) {
        const ano = data.substring(0, 4)
        const mes = data.substring(5, 7)
        const dia = data.substring(8, 10)
        return dia + "/" + mes + "/" + ano
    }

    
    async function handleFinalizarPedido(pedidoId: number) {
        try {
            const response = await fetch(`${apiUrl}/pedidos/finalizar/${pedidoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                toast.success(`Pedido #${pedidoId} finalizado com sucesso!`)
                buscaDados() 
            } else {
                toast.error(`Erro ao finalizar o pedido #${pedidoId}.`)
            }
        } catch (error) {
            toast.error("Ocorreu um erro no servidor.")
        }
    }
const pedidosTable = pedidos.map(pedido => (
    <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <p><b>Pedido #{pedido.id}</b></p>
            <p><i>Data: {dataDMA(pedido.createdAt)}</i></p>
            <p>Status: <b>{pedido.status}</b></p>
            {}
            {pedido.status === 'PENDENTE' && pedido.itens.length > 0 && (
                <button
                    onClick={() => handleFinalizarPedido(pedido.id)}
                    className="mt-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Finalizar Pedido
                </button>
            )}
        </td>
        <td className="px-6 py-4">
            {pedido.itens.length === 0 ? (
                <i>Nenhum item adicionado</i>
            ) : (
                <ul className="list-disc pl-4">
                    {pedido.itens.map(item => (
                        <li key={item.id}>
                            {item.camisa.modelo} - {item.quantidade}x  
                            (R$: {Number(item.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })})
                        </li>
                    ))}
                </ul>
            )}
        </td>
    </tr>
))

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-black">
                Listagem de Meus Pedidos
            </h1>

            {pedidos.length === 0 ?
                <h2 className="mb-4 mt-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-black">
                    &nbsp;&nbsp; Você ainda não fez nenhum pedido. 🛒
                </h2>
                :
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Pedido</th>
                            <th scope="col" className="px-6 py-3">Itens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosTable}
                    </tbody>
                </table>
            }
        </section>
    )
}