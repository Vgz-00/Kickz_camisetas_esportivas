import { Router, Response } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../utils/ayncHandler";
import { verificaTokenCliente, ClienteReq } from "../middlewares/verificaTokenCliente";
import { verificaTokenAdmin, AdminReq } from "../middlewares/verificaTokenAdmin";
import { avaliacaoSchema, respostaAdminSchema } from "../schemas/avaliacao.schema";

const router = Router();

router.post("/", verificaTokenCliente, asyncHandler(async (req: ClienteReq, res: Response) => {
  const data = avaliacaoSchema.parse(req.body);
  const clienteId = req.cliente?.clienteId;
  if (!clienteId) return res.status(401).json({ error: "Cliente não autenticado" });

  const jaAvaliou = await prisma.avaliacaoCamisa.findFirst({
    where: { clienteId, camisaId: data.camisaId },
  });
  if (jaAvaliou) return res.status(400).json({ error: "Cliente já avaliou esta camisa." });

  const avaliacao = await prisma.avaliacaoCamisa.create({
    data: { clienteId, camisaId: data.camisaId, nota: data.nota, comentario: data.comentario },
  });

  res.status(201).json(avaliacao);
}));

router.get("/", verificaTokenAdmin, asyncHandler(async (req: AdminReq, res: Response) => {
  const avaliacoes = await prisma.avaliacaoCamisa.findMany({
    include: {
      cliente: { select: { id: true, nome: true, email: true } },
      camisa: { select: { id: true, modelo: true, categoria: true } },
    },
    orderBy: { criadoEm: "desc" },
  });
  res.json(avaliacoes);
}));

router.put("/:id/resposta", verificaTokenAdmin, asyncHandler(async (req: AdminReq, res: Response) => {
  const data = respostaAdminSchema.parse(req.body);
  const avaliacao = await prisma.avaliacaoCamisa.update({
    where: { id: req.params.id },
    data: { resposta: data.resposta },
  });
  res.json({ message: "Resposta adicionada com sucesso.", avaliacao });
}));

router.patch("/:id/visivel", verificaTokenAdmin, asyncHandler(async (req: AdminReq, res: Response) => {
  const { visivel } = req.body;
  if (typeof visivel !== "boolean") return res.status(400).json({ error: "O campo 'visivel' deve ser booleano." });

  const avaliacao = await prisma.avaliacaoCamisa.update({
    where: { id: req.params.id },
    data: { visivel },
  });

  res.json({ message: `Avaliação agora está ${visivel ? "visível" : "oculta"}.`, avaliacao });
}));

router.get("/camisa/:id", asyncHandler(async (req, res) => {
  const avaliacoes = await prisma.avaliacaoCamisa.findMany({
    where: {
      camisaId: Number(req.params.id),
      visivel: true,
    },
    include: {
      cliente: { select: { nome: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  res.json(avaliacoes);
}));

router.get(
  "/media/:id",
  asyncHandler(async (req, res) => {
    const camisaId = Number(req.params.id);

    const avaliacoes = await prisma.avaliacaoCamisa.findMany({
      where: { camisaId, visivel: true },
      select: { nota: true },
    });

    if (avaliacoes.length === 0)
      return res.json({ media: null, total: 0 });

    const notasValidas = avaliacoes
  .map(a => a.nota)
  .filter((n): n is number => n !== null && n !== undefined);

if (notasValidas.length === 0)
    return res.json({ media: null, total: 0 });

    const soma = notasValidas.reduce((acc, n) => acc + n, 0);
    const media = soma / notasValidas.length;

    res.json({ media, total: notasValidas.length });

    res.json({ media, total: avaliacoes.length });
  })
);

export default router;
