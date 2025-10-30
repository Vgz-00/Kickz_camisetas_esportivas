import type { CamisaType } from "./utils/CamisaType";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  quantidade: number;
};

type AvaliacaoType = {
  id: number;
  nota: number;
  comentario: string;
  criadoEm: string;
  visivel?: boolean;
  resposta?: string | null;
  cliente: { nome: string };
};

type AvaliacaoForm = {
  nota: number;
  comentario: string;
};

export default function Detalhes() {
  const params = useParams();
  const [camisa, setCamisa] = useState<CamisaType>();
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoType[]>([]);
  const { cliente } = useClienteStore();

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { register: registerAvaliacao, handleSubmit: handleAvaliacao, reset: resetAvaliacao } =
    useForm<AvaliacaoForm>();

  useEffect(() => {
    async function buscaDados() {
      try {
        const camisaRes = await fetch(`${apiUrl}/camisas/${params.camisaId}`);
        const camisaData = await camisaRes.json();
        setCamisa(camisaData);

        const avaliacoesRes = await fetch(`${apiUrl}/avaliacoes/camisa/${params.camisaId}`);
        const avaliacoesData = await avaliacoesRes.json();

        // Filtra apenas avaliações visíveis
        const visiveis = avaliacoesData.filter((a: AvaliacaoType) => a.visivel !== false);
        setAvaliacoes(visiveis);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    buscaDados();
  }, [params.camisaId]);

  async function adicionarAoCarrinho(data: Inputs) {
    try {
      const token = localStorage.getItem("token");

      let pedidoRes = await fetch(`${apiUrl}/pedidos/pendente`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let pedido = null;

      if (pedidoRes.status === 404) {
        const novoRes = await fetch(`${apiUrl}/pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!novoRes.ok) {
          const erro = await novoRes.json();
          toast.error(erro.erro || "Falha ao criar novo carrinho. Faça login novamente.");
          return;
        }

        pedido = await novoRes.json();
      } else if (pedidoRes.ok) {
        pedido = await pedidoRes.json();
      } else {
        const erro = await pedidoRes.json();
        toast.error(erro.erro || "Erro ao buscar carrinho. Faça login novamente.");
        return;
      }

      const itemRes = await fetch(`${apiUrl}/pedidos/${pedido.id}/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          camisaId: camisa?.id,
          quantidade: Number(data.quantidade),
        }),
      });

      if (itemRes.ok) {
        toast.success("Item adicionado ao carrinho!");
        reset();
      } else {
        const erro = await itemRes.json();
        toast.error(erro.erro || "Erro ao adicionar item.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro no servidor.");
    }
  }

  async function enviarAvaliacao(data: AvaliacaoForm) {
    if (!cliente.id) {
      toast.error("Faça login para avaliar!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          camisaId: camisa?.id,
          nota: Number(data.nota),
          comentario: data.comentario,
        }),
      });

      if (response.ok) {
        toast.success("Avaliação enviada com sucesso!");
        resetAvaliacao();

        const avaliacoesRes = await fetch(`${apiUrl}/avaliacoes/camisa/${params.camisaId}`);
        const atualizadas = await avaliacoesRes.json();
        const visiveis = atualizadas.filter((a: AvaliacaoType) => a.visivel !== false);
        setAvaliacoes(visiveis);
      } else {
        const erro = await response.json();
        toast.error(erro.error || "Erro ao enviar avaliação.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro no servidor.");
    }
  }

  return (
    <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl">
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
        src={camisa?.foto}
        alt={camisa?.modelo}
      />
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-2xl font-bold tracking-tight">{camisa?.modelo}</h5>
        <h5 className="mb-2 text-xl text-gray-700">
          Preço: R$ {camisa?.preco?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </h5>
        <p className="mb-3 font-normal text-gray-700">{camisa?.categoria}</p>

        {cliente.id ? (
          <>
            <h3 className="text-xl font-bold mt-4">Adicionar ao carrinho</h3>
            <form onSubmit={handleSubmit(adicionarAoCarrinho)}>
              <input
                type="text"
                value={`${cliente.nome} (${cliente.email})`}
                disabled
                readOnly
                className="w-full mb-2 p-2 rounded bg-gray-100"
              />
              <label>Quantidade:</label>
              <input
                type="number"
                {...register("quantidade")}
                defaultValue={1}
                min={1}
                className="block w-full mb-2 p-2 rounded border"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white p-2 rounded w-full hover:bg-blue-800 transition"
              >
                Adicionar
              </button>
            </form>

            <hr className="my-4" />

            <h3 className="text-xl font-bold mt-4">Avaliar esta camisa</h3>
            <form onSubmit={handleAvaliacao(enviarAvaliacao)}>
              <label>Nota (1 a 5):</label>
              <input
                type="number"
                {...registerAvaliacao("nota")}
                min={1}
                max={5}
                required
                className="block w-full mb-2 p-2 border rounded"
              />
              <textarea
                {...registerAvaliacao("comentario")}
                placeholder="Escreva seu comentário..."
                required
                className="block w-full mb-2 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-700 text-white p-2 rounded w-full hover:bg-green-800 transition"
              >
                Enviar Avaliação
              </button>
            </form>
          </>
        ) : (
          <h2 className="mb-2 text-xl text-gray-600">😎 Faça login para comprar e avaliar!</h2>
        )}

        <hr className="my-6" />
        <h3 className="text-xl font-bold mb-2">Avaliações dos clientes</h3>

        {avaliacoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma avaliação ainda 😅</p>
        ) : (
          avaliacoes.map((a) => (
            <div key={a.id} className="bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
              <p className="text-yellow-500 font-semibold">⭐ {a.nota}/5</p>
              <p className="text-gray-800">{a.comentario}</p>
              <p className="text-sm text-gray-600">por {a.cliente.nome}</p>

              {a.resposta && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                  <p className="text-sm text-blue-700 font-semibold">
                    Resposta do administrador:
                  </p>
                  <p className="text-sm text-blue-600">{a.resposta}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
