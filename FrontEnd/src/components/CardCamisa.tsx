import { Link } from "react-router-dom";
import type { CamisaType } from "../utils/CamisaType";
import { useEffect, useState } from "react";

type AvaliacaoResumo = {
  nota: number;
};

export function CardCamisa({ data }: { data: CamisaType }) {
  const [media, setMedia] = useState<number | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch(`${apiUrl}/avaliacoes/camisa/${data.id}`);
        if (res.ok) {
          const avaliacoes: AvaliacaoResumo[] = await res.json();
          if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
            setMedia(soma / avaliacoes.length);
          } else {
            setMedia(null);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
      }
    }
    fetchMedia();
  }, [data.id, apiUrl]);

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/detalhes/${data.id}`}>
        <img
          className="p-8 rounded-t-lg object-cover transition-transform duration-300 transform hover:scale-105"
          src={data.foto}
          alt={`${data.marca.nome} ${data.modelo}`}
        />
      </Link>

      <div className="p-5">
        <Link to={`/detalhes/${data.id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.marca.nome} {data.modelo}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          R$ {Number(data.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Categoria: {data.categoria}
        </p>

        {/* ⭐ Média das avaliações */}
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  media && star <= Math.round(media)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm ms-3">
            {media ? media.toFixed(1) : "—"}
          </span>
        </div>

        <Link
          to={`/detalhes/${data.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Ver Detalhes
          <svg
            className="w-3.5 h-3.5 ms-2"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
