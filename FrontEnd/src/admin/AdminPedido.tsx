import { useEffect, useState } from "react";
import ItemPedido from "./components/ItemPedido"; 
import type { PedidoType } from "../utils/PedidoType"; 
import { useAdminStore } from "./context/AdminContext";
import { FaBoxes } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminPedido() {
    const [pedidos, setPedidos] = useState<PedidoType[]>([])
    const { admin } = useAdminStore(); 

    useEffect(() => {
  async function getPedidos() {
    const token = localStorage.getItem("tokenAdmin");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/pedidos/admin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dados = await response.json();
        setPedidos(dados);
      } else {
        console.error("Erro ao carregar pedidos:", response.statusText);
        alert("Erro ao carregar pedidos. Faça login novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição de pedidos:", error);
      alert("Erro de conexão ao carregar pedidos.");
    }
  }

  getPedidos();
}, []); 

    const listaPedidos = pedidos.map(pedido => (
        <ItemPedido key={pedido.id} pedido={pedido} pedidos={pedidos} setPedidos={setPedidos} />
    ))

    return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between items-center'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white flex items-center gap-2">
          <FaBoxes className="text-blue-700 dark:text-blue-400" />
          Controle de Pedidos
        </h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID do Pedido
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Data
              </th>
              <th scope="col" className="px-6 py-3">
                Valor Total
              </th>
              <th scope="col" className="px-6 py-3">
                Ações / Detalhes
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
                listaPedidos
            ) : (
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td colSpan={5} className="px-6 py-4 text-center">
                        {admin?.token ? "Nenhum pedido encontrado." : "Autenticando..."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) 
}