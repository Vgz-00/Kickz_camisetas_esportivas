import { Router } from "express";
import { createCliente, listCliente, loginCliente } from "../controllers/clienteController";


const router = Router();


router.post('/', createCliente)
router.get('/', listCliente) 
router.post('/login', loginCliente)

export default router