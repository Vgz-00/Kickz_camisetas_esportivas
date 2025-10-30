import { useState, useEffect } from "react"; // Adicionado useEffect
import { useClienteStore } from "./context/ClienteContext";
import type { PedidoType } from "./utils/PedidoType";
import { toast } from 'sonner'
import './MeusPedidos.css' // Importação de CSS mantida

const apiUrl = import.meta.env.VITE_API_URL

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<PedidoType[]>([])
    const { cliente } = useClienteStore()

    
    async function buscaDados() {
        // Verifica se o ID do cliente está presente antes de buscar
        if (!cliente.id) {
          console.log("Cliente não logado, abortando busca de pedidos.");
          return;
        }
        
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado, abortando busca de pedidos.");
          return;
        }

        try {
            const response = await fetch(`${apiUrl}/pedidos/meus`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (!response.ok) {
                try {
                    const erro = await response.json();
                    console.error("Erro ao buscar pedidos:", erro.erro);
                } catch {
                    console.error("Erro ao buscar pedidos:", response.statusText);
                }
                setPedidos([]);
                return;
            }
            
            const dados = await response.json()
            setPedidos(dados)
        } catch (error) {
            console.error("Erro no servidor ao buscar pedidos:", error);
            setPedidos([]);
        }
    }

    // CHAMADA DA FUNÇÃO: Executa buscaDados quando o componente monta ou o cliente loga/desloga
    useEffect(() => {
        buscaDados();
    }, [cliente.id]); // Adicionamos cliente.id como dependência
    
    async function handleFinalizarPedido(pedidoId: number) {
        try {
            const token = localStorage.getItem("token"); 

            const response = await fetch(`${apiUrl}/pedidos/${pedidoId}/confirmar`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            })
            if (response.ok) {
                toast.success(`Pedido #${pedidoId} finalizado com sucesso!`)
                buscaDados() 
            } else {
                const erro = await response.json();
                toast.error(erro.erro || `Erro ao finalizar o pedido #${pedidoId}.`)
            }
        } catch (error) {
            toast.error("Ocorreu um erro no servidor.")
        }
    }
const pedidosTable = pedidos.map(pedido => (
    <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <p><b>Pedido #{pedido.id}</b></p>
            <p><i>Data: {(pedido.createdAt)}</i></p>
            <p>Status: <b>{pedido.status}</b></p>
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
