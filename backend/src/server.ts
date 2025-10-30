import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import routerClientes from "./routes/cliente";
import routerAdmins from "./routes/admin";
import routerCamisas from "./routes/camisa";
import routerMarcas from "./routes/marca";
import routerPedidos from "./routes/pedido";
import routerDashboard from "./routes/dashboard"
import routerEmail from "./routes/email";
import avaliacaoRoutes from "./routes/avaliacao";

dotenv.config();

const server = express()
const port = 3000

server.use(express.json())
server.use(cors())

server.use("/clientes", routerClientes)
server.use("/admins", routerAdmins)
server.use("/camisas", routerCamisas)
server.use("/marcas", routerMarcas)
server.use("/pedidos", routerPedidos)
server.use("/dashboard",routerDashboard)
server.use("/email",routerEmail)
server.use("/avaliacoes", avaliacaoRoutes);

server.get('/', (req, res) => {
    res.send('API: Revenda de Camisetas esportivas')
})

export default server;