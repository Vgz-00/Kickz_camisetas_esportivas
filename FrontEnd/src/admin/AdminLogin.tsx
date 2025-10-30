import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useAdminStore } from "./context/AdminContext";


import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL 

type Inputs = {

   email: string
   senha: string

}

export default function AdminLogin() {

    const { register, handleSubmit, setFocus } = useForm<Inputs>()
    const navigate = useNavigate()
    const { logaAdmin } = useAdminStore()

    useEffect(() => {
        setFocus("email")
    }, [])
    
    async function verificaLogin(data: Inputs) {
       const response = await fetch(`${apiUrl}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha })
       })
       
       if (response.status == 200) {
          const resultado = await response.json()
          
          const admin = {
          ...resultado.admin,
          token: resultado.token,
               };

          logaAdmin(admin)
          navigate("/admin", { replace: true })
       }  else if (response.status == 400) {
        toast.error("Erro... Login ou senha incorretos")
       }  
    }
    
    return (
    <section className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="w-full max-w-sm p-6 bg-white border border-blue-200 rounded-2xl shadow-lg sm:p-8 md:p-10">
        <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
          <div className="flex flex-col items-center">
            <img
              src="../LogoTesteAdm.png"
              alt="Logo KicksCamisetas"
              className="w-28 mb-2"
            />
            <h5 className="text-2xl font-bold text-blue-800">
              Login Administrativo
            </h5>
            <p className="text-sm text-gray-600">
              Acesse o painel de controle
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              E-mail
            </label>
            <input
              type="email"
              placeholder="admin@empresa.com"
              {...register("email", { required: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("senha", { required: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 
            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
            rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-150"
          >
            Entrar
          </button>

         
        </form>
      </div>

      <Toaster richColors position="top-right" />
    </section>
  );
}