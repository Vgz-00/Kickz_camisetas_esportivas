import { Router } from "express";
import { createPedido, listPedido, listPedidosByCliente, findPedidoPendente, finalizarPedido } from "../controllers/pedidoController";


const router = Router();


router.post('/', createPedido)
router.get('/', listPedido) 
router.get('/:clienteId', listPedidosByCliente)
router.get('/pendente/:clienteId', findPedidoPendente);
router.put('/finalizar/:id', finalizarPedido);

export default router