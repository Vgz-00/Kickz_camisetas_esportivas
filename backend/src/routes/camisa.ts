import { Router, Response } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../utils/ayncHandler";
import { verificaTokenAdmin, AdminReq } from "../middlewares/verificaTokenAdmin";
import { camisaSchema } from "../schemas/camisaSchema";

const router = Router();

/** POST // ADMIN => cadastrar nova camisa */
router.post(
  "/",
  verificaTokenAdmin,
  asyncHandler(async (req: AdminReq, res: Response) => {
    const data = camisaSchema.parse(req.body);
    const camisa = await prisma.camisa.create({
      data: {
        modelo: data.modelo,
        preco: data.preco,
        foto: data.foto,
        categoria: data.categoria,
        destaque: data.destaque ?? true,
        marcaId: data.marcaId,
      },
    });
    res.status(201).json(camisa);
  })
);

router.patch(
  "/:id/destaque",
  verificaTokenAdmin,
  asyncHandler(async (req: AdminReq, res: Response) => {
    const { destaque } = req.body;
    if (typeof destaque !== "boolean") return res.status(400).json({ error: "Campo 'destaque' deve ser booleano" });

    const camisa = await prisma.camisa.update({
      where: { id: Number(req.params.id) },
      data: { destaque },
    });

    res.json({ message: "Destaque atualizado com sucesso", camisa });
  })
);

router.delete(
  "/:id",
  verificaTokenAdmin,
  asyncHandler(async (req: AdminReq, res: Response) => {
    const id = Number(req.params.id);
    const camisa = await prisma.camisa.findUnique({ where: { id } });
    if (!camisa) return res.status(404).json({ error: "Camisa não encontrada" });

    await prisma.camisa.delete({ where: { id } });
    res.json({ message: "Camisa removida com sucesso" });
  })
);

router.get(
  "/",
  asyncHandler(async (_req, res: Response) => {
    const { modelo, marcaId, destaque } = _req.query;
    const filtros: any = {};

    if (modelo) filtros.modelo = { contains: String(modelo), mode: "insensitive" };
    if (marcaId) filtros.marcaId = Number(marcaId);
    if (destaque === "true") filtros.destaque = true;

    const camisas = await prisma.camisa.findMany({
      where: filtros,
      include: { marca: true },
      orderBy: { modelo: "asc" },
    });

    res.json(camisas);
  })
);

router.get(
  "/:id",
  asyncHandler(async (_req, res: Response) => {
    const camisa = await prisma.camisa.findUnique({
      where: { id: Number(_req.params.id) },
      include: {
        marca: true,
        interacoes: { include: { cliente: true } },
      },
    });

    if (!camisa) return res.status(404).json({ error: "Camisa não encontrada" });
    res.json(camisa);
  })
);

router.get(
  "/pesquisa/:termo",
  asyncHandler(async (req, res: Response) => {
    const termo = req.params.termo;
    if (!termo || termo.length < 2) {
      return res.status(400).json({ error: "Informe pelo menos 2 caracteres" });
    }

    const camisas = await prisma.camisa.findMany({
      where: {
        OR: [
          { modelo: { contains: termo, mode: "insensitive" } },
          { marca: { nome: { contains: termo, mode: "insensitive" } } },
        ],
      },
      include: { marca: true },
      orderBy: { modelo: "asc" },
    });

    res.json(camisas);
  })
);


export default router;
