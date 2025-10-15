import express from "express";
import cors from 'cors';

import routerClientes from "./routes/cliente";
import routerAdmins from "./routes/admin";
import routerCamisas from "./routes/camisa";
import routerMarcas from "./routes/marca";
import routerItensPedido from "./routes/itenPedido";
import routerPedidos from "./routes/pedido";
import routerDashboard from "./routes/dashboard"
import routerEmail from "./routes/email";

const server = express()
const port = 3000

server.use(express.json())
server.use(cors())

server.use("/clientes", routerClientes)
server.use("/admins", routerAdmins)
server.use("/camisas", routerCamisas)
server.use("/marcas", routerMarcas)
server.use("/itensPedido", routerItensPedido)
server.use("/pedidos", routerPedidos)
server.use("/dashboard",routerDashboard)
server.use("/email",routerEmail)

server.get('/', (req, res) => {
    res.send('API: Revenda de Camisetas esportivas')
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})