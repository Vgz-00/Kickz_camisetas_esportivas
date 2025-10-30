import { useState } from "react";
import { FaReply, FaEye, FaEyeSlash } from "react-icons/fa";
import type { AvaliacaoType } from "../AdminAvaliacao";

type ActionHandlers = {
  onResponder: (avaliacaoId: number, resposta: string) => Promise<void>;
  onAlternarVisibilidade: (
    avaliacaoId: number,
    visivel: boolean
  ) => Promise<void>;
};

type ItemAvaliacaoProps = {
  avaliacao: AvaliacaoType;
  avaliacoes: AvaliacaoType[];
  setAvaliacoes: React.Dispatch<React.SetStateAction<AvaliacaoType[]>>;
} & ActionHandlers;

export default function ItemAvaliacao({
  avaliacao,
  onResponder,
  onAlternarVisibilidade,
}: ItemAvaliacaoProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [respostaText, setRespostaText] = useState(avaliacao.resposta || "");

  const handleEnviarResposta = async () => {
    if (respostaText.trim() === "") {
      return alert("A resposta não pode estar vazia.");
    }
    await onResponder(avaliacao.id, respostaText.trim());
    setIsResponding(false);
  };

  const handleToggleVisibilidade = async () => {
    const newVisivel = !avaliacao.visivel;
    await onAlternarVisibilidade(avaliacao.id, newVisivel);
  };

  const imagemValida =
    avaliacao.camisa.foto && avaliacao.camisa.foto.startsWith("http")
      ? avaliacao.camisa.foto
      : "/defaultCamisa.png"; 

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {avaliacao.cliente.nome}
      </td>

      <td className="px-6 py-4 flex items-center gap-3">
        <img
          src={imagemValida}
          alt={avaliacao.camisa.modelo}
          className="w-10 h-10 rounded object-cover"
          onError={(e) =>
            ((e.target as HTMLImageElement).src = "/default-camisa.png")
          }
        />
        <span>{avaliacao.camisa.modelo}</span>
      </td>

      <td className="px-6 py-4 text-yellow-500 font-bold">
        {avaliacao.nota} ⭐
      </td>

      <td className="px-6 py-4 max-w-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-300">
          Comentário:
        </p>
        <p className="italic mb-2">{avaliacao.comentario}</p>

        {(avaliacao.resposta || isResponding) && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded">
            <p className="font-semibold text-blue-600 dark:text-blue-300">
              Resposta:
            </p>
            {isResponding ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  rows={3}
                  value={respostaText}
                  onChange={(e) => setRespostaText(e.target.value)}
                  placeholder="Digite sua resposta..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEnviarResposta}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded"
                  >
                    Salvar Resposta
                  </button>
                  <button
                    onClick={() => {
                      setIsResponding(false);
                      setRespostaText(avaliacao.resposta || "");
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold py-1 px-3 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p>{avaliacao.resposta}</p>
            )}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <span
          className={`font-bold p-1 rounded text-white text-xs ${
            avaliacao.visivel ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {avaliacao.visivel ? "SIM" : "NÃO"}
        </span>
      </td>

      <td className="px-6 py-4 flex items-center gap-3">
        {!avaliacao.resposta && !isResponding && (
          <FaReply
            className="text-2xl text-blue-600 cursor-pointer"
            title="Responder avaliação"
            onClick={() => setIsResponding(true)}
          />
        )}
        {avaliacao.visivel ? (
          <FaEyeSlash
            className="text-2xl text-orange-500 cursor-pointer"
            title="Ocultar avaliação"
            onClick={handleToggleVisibilidade}
          />
        ) : (
          <FaEye
            className="text-2xl text-green-500 cursor-pointer"
            title="Tornar visível"
            onClick={handleToggleVisibilidade}
          />
        )}
      </td>
    </tr>
  );
}
