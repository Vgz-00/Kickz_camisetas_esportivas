import { useEffect, useState } from "react";

import ItemCamisa from "./components/ItemCamisa";
import type { CamisaType } from "../utils/CamisaType";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCamisa() {
    const [camisas, setCamisas] = useState<CamisaType[]>([])

    useEffect(() => {
        async function getCamisas() {
            const response = await fetch(`${apiUrl}/camisas`)
            const dados = await response.json()
            setCamisas(dados)
        }
        getCamisas()   
    }, [])

    const listaCamisas = camisas.map(camisa => (
        <ItemCamisa key={camisa.id} camisa={camisa} camisas={camisas} setCamisas={setCamisas} />
    ))

    return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Carros
        </h1>
        <Link to="/admin/carros/novo" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Novo Carro
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Modelo do Carro
              </th>
              <th scope="col" className="px-6 py-3">
                Marca
              </th>
              <th scope="col" className="px-6 py-3">
                Ano
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaCamisas}
          </tbody>
        </table>
      </div>
    </div>
  ) 
}