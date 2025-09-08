import express from "express";
  
import routerClientes from "./routes/cliente";
import routerAdmins from "./routes/admin";
import routerCamisas from "./routes/camisa";
import routerMarcas from "./routes/marca";
import routerItensPedido from "./routes/itenPedido";
import routerPedidos from "./routes/pedido";


const server = express()
const port = 3000

server.use(express.json())

server.use("/clientes", routerClientes)
server.use("/admins", routerAdmins)
server.use("/camisas", routerCamisas)
server.use("/marcas", routerMarcas)
server.use("/itensPedido", routerItensPedido)
server.use("/pedidos", routerPedidos)

server.get('/', (req, res) => {
    res.send('API: Revenda de Camisetas esportivas')
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})