import { Router } from "express";
import { createCamisa, listcamisa, searchCamisa, getCamisaById, updateCamisa, deleteCamisa } from "../controllers/camisaController";


const router = Router();


router.post('/', createCamisa)
router.get('/', listcamisa) 
router.get("/:id", getCamisaById)
router.get("/pesquisa/:termo", searchCamisa);
router.put("/:id", updateCamisa)
router.delete("/:id", deleteCamisa)

export default router