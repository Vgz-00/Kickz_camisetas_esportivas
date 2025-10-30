import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../utils/ayncHandler";
import { verificaTokenAdmin } from "../middlewares/verificaTokenAdmin";

const router = Router();



router.get("/gerais", verificaTokenAdmin, asyncHandler(async (_req, res) => {
  const [totalCamisas, totalPedidos, totalClientes, totalMarcas, pedidosPendentes] =
    await Promise.all([
      prisma.camisa.count(),
      prisma.pedido.count(),
      prisma.cliente.count(),
      prisma.marca.count(),
      prisma.pedido.count({ where: { status: "PENDENTE" } }),
    ]);

  res.status(200).json({
    totais: { camisas: totalCamisas, pedidos: totalPedidos, clientes: totalClientes, marcas: totalMarcas },
    pendentes: pedidosPendentes,
  });
}));


router.get("/camisasMarca", verificaTokenAdmin, asyncHandler(async (_req, res) => {
  const marcas = await prisma.marca.findMany({
    select: { nome: true, camisa: { select: { id: true } } },
  });

  const resultado = marcas.map(m => ({
    marca: m.nome,
    totalCamisas: m.camisa.length,
  }));

  res.status(200).json(resultado);
}));

router.get("/camisasMaisVendidas", verificaTokenAdmin, asyncHandler(async (_req, res) => {
  const camisasVendidas = await prisma.itensPedido.groupBy({
    by: ["camisaId"],
    _sum: { quantidade: true },
    orderBy: { _sum: { quantidade: "desc" } },
    take: 10,
  });

  const idsCamisas = camisasVendidas.map(c => c.camisaId);

  const camisas = await prisma.camisa.findMany({
    where: { id: { in: idsCamisas } },
    select: { id: true, modelo: true, preco: true, marca: true },
  });

  const resultado = camisasVendidas.map(v => ({
    camisa: camisas.find(c => c.id === v.camisaId),
    totalVendido: v._sum.quantidade ?? 0,
  }));

  res.status(200).json(resultado);
}));

export default router;
