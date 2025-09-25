import { CardCamisa } from "./components/CardCamisa";
import { InputPesquisa } from "./components/InputPesquisa";
import type { CamisaType } from "./utils/CamisaType";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [camisas, setCamisas] = useState<CamisaType[]>([]);
  

    useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/camisas`)
      const dados = await response.json()

      setCamisas(dados)
    }
    buscaDados()
  }, [])

  const camisalista = camisas.map((camisa) => (
    <CardCamisa data={camisa} key={camisa.id} />
  ));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto mt-6">
        <InputPesquisa setCamisas={setCamisas} />
       
      </div>

    <h1 className="text-3xl md:text-5xl font-extrabold text-center mt-12 mb-8 text-black">
  Camisas{" "}
  <span className="">
    em destaque
  </span>
</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
  {camisalista}
</div>

    </div>
  );
}
