import { TiDeleteOutline } from "react-icons/ti";
import { FaRegEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import type { PedidoType } from "../../utils/PedidoType";
import { useAdminStore } from "../context/AdminContext";
import { useState } from "react";

type ListaPedidoProps = {
  pedido: PedidoType;
  pedidos: PedidoType[];
  setPedidos: React.Dispatch<React.SetStateAction<PedidoType[]>>;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function ItemPedido({ pedido, pedidos, setPedidos }: ListaPedidoProps) {
  const { admin } = useAdminStore();
  const [aberto, setAberto] = useState(false);

  async function excluirPedido() {
    if (confirm(`Confirma exclusão do pedido #${pedido.id}?`)) {
      const response = await fetch(`${apiUrl}/pedidos/${pedido.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
      });

      if (response.status === 200) {
        setPedidos(pedidos.filter((x) => x.id !== pedido.id));
        alert("Pedido excluído com sucesso");
      } else {
        alert("Erro... Pedido não foi excluído");
      }
    }
  }

  async function alterarStatus() {
    const novoStatus = prompt(
      `Status atual: ${pedido.status}\nDigite o novo status (ex: 'PENDENTE', 'ENVIADO', 'CONCLUÍDO'):`
    );

    if (!novoStatus || novoStatus.trim() === "") return;

    const response = await fetch(`${apiUrl}/pedidos/status/${pedido.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (response.status === 200) {
      const pedidosAtualizados = pedidos.map((p) =>
        p.id === pedido.id ? { ...p, status: novoStatus } : p
      );
      setPedidos(pedidosAtualizados);
      alert("Status atualizado com sucesso");
    } else {
      alert("Erro ao atualizar status");
    }
  }

  const total = pedido.itens.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  return (
    <>
      <tr
        key={pedido.id}
        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
      >
        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
          #{pedido.id}
        </td>
        <td className="px-6 py-4">{pedido.status}</td>
        <td className="px-6 py-4">
          {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
        </td>
        <td className="px-6 py-4">
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </td>
        <td className="px-6 py-4 flex items-center gap-3">
          <TiDeleteOutline
            className="text-3xl text-red-600 cursor-pointer"
            title="Excluir pedido"
            onClick={excluirPedido}
          />
          <FaRegEdit
            className="text-3xl text-yellow-600 cursor-pointer"
            title="Alterar status"
            onClick={alterarStatus}
          />
          {aberto ? (
            <FaChevronUp
              className="text-2xl text-gray-600 cursor-pointer"
              title="Fechar itens"
              onClick={() => setAberto(false)}
            />
          ) : (
            <FaChevronDown
              className="text-2xl text-gray-600 cursor-pointer"
              title="Ver itens"
              onClick={() => setAberto(true)}
            />
          )}
        </td>
      </tr>

      {aberto && (
        <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
          <td colSpan={5} className="px-6 py-4">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-4 py-2">Camisa</th>
                  <th className="px-4 py-2">Quantidade</th>
                  <th className="px-4 py-2">Preço</th>
                  <th className="px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 flex items-center gap-3">
                      <img
                        src={item.camisa.foto}
                        alt={item.camisa.modelo}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <span>{item.camisa.modelo}</span>
                    </td>
                    <td className="px-4 py-2">{item.quantidade}</td>
                    <td className="px-4 py-2">
                      {item.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}