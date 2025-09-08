import { Router } from "express";
import { createItemPedido, listItensPedido } from "../controllers/itensPedidoController";


const router = Router();


router.post('/', createItemPedido)
router.get('/', listItensPedido) 


export default router