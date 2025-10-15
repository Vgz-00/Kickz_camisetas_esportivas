import { Router } from "express";
import { sendEmailConfirmacao } from "../controllers/emailController";

const router = Router();


router.post("/confirmacao/:pedidoId", sendEmailConfirmacao);

export default router;