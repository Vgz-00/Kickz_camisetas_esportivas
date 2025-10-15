import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MeusPedidos from './MeusPedidos.tsx'
import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Cadastro from './Cadastro.tsx'

import AdminLayout from './admin/AdminLayout.tsx';
import AdminLogin from './admin/AdminLogin.tsx';            
import AdminDashboard from './admin/AdminDashboard.tsx';    
import AdminCamisas from './admin/AdminCamisa.tsx';          
import AdminNovaCamisa from './admin/AdminNovaCamisa.tsx';                    
import AdminCadAdmin from './admin/AdminCadastroAdm.tsx'; 






const rotas = createBrowserRouter([
  {

    path: "/admin/login",
    element: <AdminLogin/>,
  },
  
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'camisas', element: <AdminCamisas /> },
      { path: 'cadastro/camisas', element: <AdminNovaCamisa /> },
      { path: 'cadAdmin', element: <AdminCadAdmin /> },
    ],
  },
  
  
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'detalhes/:camisaId', element: <Detalhes /> },
      { path: 'meusPedidos', element: <MeusPedidos /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)