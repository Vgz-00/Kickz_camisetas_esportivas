import { Router } from "express";
import { createAdmin, listAdmin } from "../controllers/adminController";


const router = Router();


router.post('/', createAdmin)
router.get('/', listAdmin) 


export default router