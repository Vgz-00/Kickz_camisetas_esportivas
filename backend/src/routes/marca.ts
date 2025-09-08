import { Router } from "express";
import { createMarca, listMarca } from "../controllers/marcaController";


const router = Router();


router.post('/', createMarca)
router.get('/', listMarca) 


export default router