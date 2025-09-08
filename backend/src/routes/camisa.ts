import { Router } from "express";
import { createCamisa, listcamisa } from "../controllers/camisaController";


const router = Router();


router.post('/', createCamisa)
router.get('/', listcamisa) 


export default router