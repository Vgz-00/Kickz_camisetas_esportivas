import { useEffect, useState, useCallback } from "react";
import ItemAvaliacao from "./components/ItemAvaliacao";
import { FaStar } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

export type AvaliacaoType = {
  id: number;
  cliente: { nome: string };
  camisa: { modelo: string; foto: string };
  nota: number;
  comentario: string;
  resposta?: string; 
  visivel: boolean; 
  createdAt: string;
};

export default function AdminAvaliacao() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoType[]>([]);

  const getAvaliacoes = useCallback(async () => {
    const token = localStorage.getItem("tokenAdmin");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/avaliacoes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dados = await response.json();
        setAvaliacoes(dados);
      } else {
        console.error("Erro ao carregar avaliações:", response.statusText);
        alert("Erro ao carregar avaliações. Faça login novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição de avaliações:", error);
      alert("Erro de conexão ao carregar avaliações.");
    }
  }, []); 

  useEffect(() => {
    getAvaliacoes();
  }, [getAvaliacoes]);

  const handleResponderAvaliacao = async (
    avaliacaoId: number,
    resposta: string
  ) => {
    const token = localStorage.getItem("tokenAdmin");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/avaliacoes/${avaliacaoId}/resposta`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resposta }),
      });

      if (response.ok) {
        const { avaliacao: avaliacaoAtualizada } = await response.json();
        setAvaliacoes((prev) =>
          prev.map((av) =>
            av.id === avaliacaoId
              ? { ...av, resposta: avaliacaoAtualizada.resposta }
              : av
          )
        );
        alert("Resposta adicionada com sucesso!");
      } else {
        const errorData = await response.json();
        console.error("Erro ao responder avaliação:", errorData.error || response.statusText);
        alert(`Erro ao responder avaliação: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Erro na requisição de resposta:", error);
      alert("Erro de conexão ao responder avaliação.");
    }
  };

 
  const handleAlternarVisibilidade = async (
    avaliacaoId: number,
    visivel: boolean
  ) => {
    const token = localStorage.getItem("tokenAdmin");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/avaliacoes/${avaliacaoId}/visivel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visivel }),
      });

      if (response.ok) {
        const { avaliacao: avaliacaoAtualizada } = await response.json();
        setAvaliacoes((prev) =>
          prev.map((av) =>
            av.id === avaliacaoId
              ? { ...av, visivel: avaliacaoAtualizada.visivel }
              : av
          )
        );
        alert(`Avaliação agora está ${visivel ? "visível" : "oculta"}.`);
      } else {
        const errorData = await response.json();
        console.error("Erro ao alterar visibilidade:", errorData.error || response.statusText);
        alert(`Erro ao alterar visibilidade: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Erro na requisição de visibilidade:", error);
      alert("Erro de conexão ao alterar visibilidade.");
    }
  };


  return (
    <div className="m-4 mt-24">
      <div className="flex justify-between items-center">
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Avaliações de Clientes
        </h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Camisa</th>
              <th scope="col" className="px-6 py-3">Nota</th>
              <th scope="col" className="px-6 py-3">Comentário / Resposta</th> 
              <th scope="col" className="px-6 py-3">Visível</th> 
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.length > 0 ? (
              avaliacoes.map(avaliacao => (
                <ItemAvaliacao
                  key={avaliacao.id}
                  avaliacao={avaliacao as AvaliacaoType} 
                  avaliacoes={avaliacoes}
                  setAvaliacoes={setAvaliacoes}
                  onResponder={handleResponderAvaliacao} 
                  onAlternarVisibilidade={handleAlternarVisibilidade} 
                />
              ))
            ) : (
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td colSpan={7} className="px-6 py-4 text-center"> 
                  Nenhuma avaliação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}