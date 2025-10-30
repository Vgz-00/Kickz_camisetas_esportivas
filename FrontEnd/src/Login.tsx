import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { useClienteStore } from "../src/context/ClienteContext"
import { toast } from "sonner"; // Usando sonner em vez de alert

const apiUrl = import.meta.env.VITE_API_URL

type LoginForm = {
  email: string
  senha: string
  manter: boolean
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const navigate = useNavigate()
  const { logaCliente } = useClienteStore()

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(`${apiUrl}/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha
        })
      })

      if (response.status === 200) {
        const dados = await response.json()

        // Esta linha salva o token correto ANTES de chamar a store
        localStorage.setItem("token", dados.token)

        logaCliente(dados.cliente) // logaCliente agora NÃO sobrescreve o token

        
        if (data.manter) {
          // CORRIGIDO: Usando JSON.stringify puro, consistente com a store
          localStorage.setItem("clienteKey", JSON.stringify(dados.cliente)) 
        } else {
          // Se não for para manter, o clienteKey é apagado, mas o token é mantido até o navegador fechar
          localStorage.removeItem("clienteKey") 
        }
        
        toast.success("Login realizado com sucesso!");
        navigate("/")
      } else {
        // CORRIGIDO: Usando toast ao invés de alert
        toast.error("E-mail ou senha inválidos");
      }
    } catch (err) {
      console.error(err)
      // CORRIGIDO: Usando toast ao invés de alert
      toast.error("Erro ao tentar logar");
    }
  }

  return (
    <section className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8  dark:border-grat-900">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="text-xl p-4 font-medium text-gray-900 dark:text-red-700">Faça login na nossa plataforma</h5>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu e-mail</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            {...register("email", { required: true })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-red-900 dark:placeholder-red-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("senha", { required: true })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-red-900 dark:placeholder-red-900 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="manter"
                                type="checkbox"
                                {...register("manter")}
                                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            />
                        </div>
                        <label htmlFor="manter" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Manter conectado
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-blue-800"
                    >
                        Entrar
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-orange-00">
                        Não registrado?
                        <Link to="/cadastro" className="text-blue-700 hover:underline dark:text-red-700 ml-1">
                            Criar conta
                        </Link>
                    </div>
                </form>
            </div>
        </section>
  )
}
