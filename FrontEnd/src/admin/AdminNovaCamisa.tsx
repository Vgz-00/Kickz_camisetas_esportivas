import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { MarcaType } from "../utils/MarcaType";
import { useAdminStore } from "./context/AdminContext";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  modelo: string;
  marcaId: number;
  preco: number;
  foto: string;
  categoria: string;
  destaque: boolean;
};

export default function AdminNovaCamisa() {
  const [marcas, setMarcas] = useState<MarcaType[]>([]);
  const { admin } = useAdminStore();

  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>();

  useEffect(() => {
    async function getMarcas() {
      try {
        const response = await fetch(`${apiUrl}/marcas`);
        const dados = await response.json();
        setMarcas(dados);
      } catch (err) {
        toast.error("Erro ao carregar marcas");
      }
    }
    getMarcas();
    setFocus("modelo");
  }, [setFocus]);

  const optionsMarca = marcas.map((marca) => (
    <option key={marca.id} value={marca.id}>
      {marca.nome}
    </option>
  ));

  async function incluirCamisa(data: Inputs) {
    const novaCamisa: Inputs = {
      modelo: data.modelo,
      marcaId: Number(data.marcaId),
      preco: Number(data.preco),
      foto: data.foto,
      categoria: data.categoria,
      destaque: data.destaque,
    };

    const response = await fetch(`${apiUrl}/camisas`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
      body: JSON.stringify(novaCamisa),
    });

    if (response.status === 201) {
      toast.success("Camisa cadastrada com sucesso!");
      reset();
    } else {
      toast.error("Erro ao cadastrar camisa...");
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white me-56">
        Inclusão de Camisas
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirCamisa)}>
        {/* Modelo */}
        <div className="mb-3">
          <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Modelo da Camisa
          </label>
          <input
            type="text"
            id="modelo"
            required
            {...register("modelo")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Marca e Categoria */}
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div>
            <label htmlFor="marcaId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Marca
            </label>
            <select
              id="marcaId"
              required
              {...register("marcaId")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione...</option>
              {optionsMarca}
            </select>
          </div>
          <div>
            <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Categoria
            </label>
            <select
              id="categoria"
              required
              {...register("categoria")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Casual">Casual</option>
              <option value="Esportiva">Esportiva</option>
              <option value="Social">Social</option>
              <option value="Infantil">Infantil</option>
            </select>
          </div>
        </div>

        {/* Preço e Destaque */}
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div>
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              id="preco"
              required
              {...register("preco")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 mt-7">
            <input
              type="checkbox"
              id="destaque"
              {...register("destaque")}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="destaque" className="text-sm font-medium text-gray-900 dark:text-white">
              Destaque
            </label>
          </div>
        </div>

        {/* Foto */}
        <div className="mb-3">
          <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            URL da Foto
          </label>
          <input
            type="text"
            id="foto"
            required
            {...register("foto")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Incluir
        </button>
      </form>
    </>
  );
}
