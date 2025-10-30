import { Router, Response } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../utils/ayncHandler";
import { verificaTokenAdmin, AdminReq } from "../middlewares/verificaTokenAdmin";
import { marcaSchema } from "../schemas/marcaSchema";

const router = Router();

router.post(
  "/",
  verificaTokenAdmin,
  asyncHandler(async (req: AdminReq, res: Response) => {
    const data = marcaSchema.parse(req.body);

    const marcaExistente = await prisma.marca.findFirst({
      where: { nome: { equals: data.nome, mode: "insensitive" } },
    });

    if (marcaExistente) return res.status(400).json({ error: "Já existe uma marca com esse nome." });

    const marca = await prisma.marca.create({ data });
    res.status(201).json({ message: "Marca criada com sucesso.", marca });
  })
);

router.get("/", asyncHandler(async (_req, res: Response) => {
  const marcas = await prisma.marca.findMany({ include: { camisa: true }, orderBy: { nome: "asc" } });
  res.json(marcas);
}));

export default router;
