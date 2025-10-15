import { Router } from "express";
import { getDashboardGerais, getDashboardCamisasMarca, getDashboardCamisasMaisVendidas, } from "../controllers/dashboardController";

const router = Router();

router.get("/gerais", getDashboardGerais);
router.get("/camisasMarca", getDashboardCamisasMarca);
router.get("/camisasMaisVendidas", getDashboardCamisasMaisVendidas);

export default router;