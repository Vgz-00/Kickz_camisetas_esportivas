import { Router } from "express";
import { createAdmin, listAdmin, LoginAdmin } from "../controllers/adminController";


const router = Router();


router.post('/', createAdmin)
router.get('/', listAdmin) 
router.post('/login', LoginAdmin)

export default router