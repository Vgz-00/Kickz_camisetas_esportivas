import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Link } from "react-router-dom"

type Inputs = {
  nome: string
  email: string
  senha: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
  const { register, handleSubmit } = useForm<Inputs>()
  const navigate = useNavigate()

  async function cadastrar(data: Inputs) {
    const response = await fetch(`${apiUrl}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      toast.success("Cadastro realizado com sucesso!")
      navigate("/login")
    } else {
      toast.error("Erro ao cadastrar")
    }
  }

  return (
   <section className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-200">
                <form className="space-y-6" onSubmit={handleSubmit(cadastrar)}>
                    <h5 className="text-xl p-5 font-medium text-gray-900 dark:text-red-700">Cadastro de Cliente</h5>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu nome</label>
                        <input
                            type="text"
                            placeholder="Nome"
                            {...register("nome")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-red-900 dark:placeholder-red-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu e-mail</label>
                        <input
                            type="email"
                            placeholder="E-mail"
                            {...register("email")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-red-900 dark:placeholder-red-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("senha")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-red-900 dark:placeholder-red-900 dark:text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-blue-800"
                    >
                        Cadastrar
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-orange-00">
                        Já tem uma conta?
                        <Link to="/login" className="text-blue-700 hover:underline dark:text-red-700 ml-1">
                            Logar
                        </Link>
                    </div>
                </form>
            </div>
        </section>
  )
}
