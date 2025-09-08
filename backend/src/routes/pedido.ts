import { Router } from "express";
import { createPedido, listPedido } from "../controllers/pedidoController";


const router = Router();


router.post('/', createPedido)
router.get('/', listPedido) 


export default router