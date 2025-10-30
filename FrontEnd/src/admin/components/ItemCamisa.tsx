import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"

import type { CamisaType } from "../../utils/CamisaType"
import { useAdminStore } from "../context/AdminContext"

type listaCamisaProps = {
  camisa: CamisaType;
  camisas: CamisaType[];
  setCamisas: React.Dispatch<React.SetStateAction<CamisaType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemCamisa({ camisa, camisas, setCamisas }: listaCamisaProps) {
  const { admin } = useAdminStore()

  async function excluirCamisa() {
    if (!admin || admin.nivel == 1) {
      alert("Você não tem permissão para excluir camisas");
      return;
    }

    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${apiUrl}/camisas/${camisa.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )

      if (response.status == 200) {
        const camisasAtualizadas = camisas.filter(x => x.id != camisa.id)
        setCamisas(camisasAtualizadas)
        alert("Camisa excluída com sucesso")
      } else {
        alert("Erro... Camisa não foi excluída")
      }
    }
  }

  async function alterarCamisetaDestaque() {
  const response = await fetch(`${apiUrl}/camisas/${camisa.id}/destaque`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${admin.token}`
    },
    body: JSON.stringify({ destaque: !camisa.destaque }) // ✅ envia o valor invertido
  });

  if (response.ok) {
    const camisasAtualizadas = camisas.map(x => {
      if (x.id === camisa.id) {
        return { ...x, destaque: !x.destaque }
      }
      return x
    })
    setCamisas(camisasAtualizadas)
  } else {
    const erro = await response.json();
    alert("Erro ao alterar destaque: " + erro.error);
  }
}

  return (
      <tr key={camisa.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={camisa.foto} alt={`Foto do ${camisa.marca}`}
          style={{ width: 200 }} />
      </th>
      <td className={`px-6 py-4 ${camisa.destaque ? "font-extrabold" : ""}`}>
        {camisa.modelo}
      </td>
      <td className={`px-6 py-4 ${camisa.destaque ? "font-extrabold" : ""}`}>
        {camisa.marca.nome}
      </td>
      <td className={`px-6 py-4 ${camisa.destaque ? "font-extrabold" : ""}`}>
        {camisa.categoria}
      </td>
      <td className={`px-6 py-4 ${camisa.destaque ? "font-extrabold" : ""}`}>
        {Number(camisa.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirCamisa} />&nbsp;
        <FaRegStar className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Destacar"
          onClick={alterarCamisetaDestaque} />
      </td>
    </tr>
  );
}