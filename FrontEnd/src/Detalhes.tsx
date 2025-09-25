
import type { CamisaType } from "./utils/CamisaType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'


const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  quantidade: number
}

export default function Detalhes() {
  const params = useParams()
  

  const [camisa, setCamisa] = useState<CamisaType>()
  const { cliente } = useClienteStore()

  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/camisas/${params.camisaId}`)
      const dados = await response.json()
      setCamisa(dados)
    }
    buscaDados()
  }, [params.camisaId])

  async function adicionarAoCarrinho(data: Inputs) {
    if (!cliente || !camisa) {
        toast.error("Erro. É necessário estar logado para adicionar itens ao carrinho.")
        return
    }

    try {
       
        const pedidoResponse = await fetch(`${apiUrl}/pedidos/pendente/${cliente.id}`)
        let pedido = null

        if (pedidoResponse.ok) {
            pedido = await pedidoResponse.json()
        } else if (pedidoResponse.status === 404) {
            const newpedidoResponse = await fetch(`${apiUrl}/pedidos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clienteId: cliente.id })
            })
            if (!newpedidoResponse.ok) {
                toast.error("Erro ao criar um novo pedido.")
                return
            }
            pedido = await newpedidoResponse.json()
        } else {
            toast.error("Erro ao buscar pedido existente.")
            return;
        }

       
        const itemResponse = await fetch(`${apiUrl}/itensPedido`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pedidoId: pedido.id,
                camisaId: camisa.id,
               
                quantidade: Number(data.quantidade),
                preco: Number(camisa.preco),
            })
        })

        if (itemResponse.status === 201) {
            toast.success("Item adicionado ao seu carrinho!")
            reset()
        } else {
            toast.error("Erro ao adicionar item ao pedido.")
        }
    } catch (err) {
        console.error(err)
        toast.error("Ocorreu um erro. Tente novamente.")
    }
}

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
          src={camisa?.foto} alt="Foto da camisa" />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {camisa?.modelo}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Preço R$: {camisa?.preco ? Number(camisa.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 }) : 'N/A'}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {camisa?.categoria}
          </p>
          {cliente.id ?
            <>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Adicione ao seu carrinho
              </h3>
              <form onSubmit={handleSubmit(adicionarAoCarrinho)}>
                <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${cliente.nome} (${cliente.email})`} disabled readOnly />
                <div className="flex items-center mb-2">
                  <label htmlFor="quantidade" className="mr-2 text-gray-900 dark:text-white">Quantidade:</label>
                  <input
                    type="number"
                    id="quantidade"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    defaultValue={1}
                    min={1}
                    {...register("quantidade", { valueAsNumber: true })}
                  />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar ao Carrinho</button>
              </form>
            </>
            :
            <h2 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              😎Gostou? Identifique-se e faça seu Pedido!
            </h2>
          }
        </div>
      </section>
    </>
  )
}