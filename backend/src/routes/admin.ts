import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { adminSchema, loginSchema } from "../schemas/adminSchema";
import { asyncHandler } from "../utils/ayncHandler";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/cadastrar",
  asyncHandler(async (_req, res: Response) => {
    const dados = adminSchema.parse(_req.body);
    const senhaHash = await bcrypt.hash(dados.senha, 12);

    const novoAdmin = await prisma.admin.create({ data: { ...dados, senha: senhaHash } });
    res.status(201).json({ mensagem: "Administrador criado", novoAdmin });
  })
);

router.post(
  "/login",
  asyncHandler(async (_req, res: Response) => {
    const dados = loginSchema.parse(_req.body);
    const admin = await prisma.admin.findUnique({ where: { email: dados.email } });
    if (!admin) return res.status(401).json({ erro: "Credenciais inválidas" });

    const senhaOk = await bcrypt.compare(dados.senha, admin.senha);
    if (!senhaOk) return res.status(401).json({ erro: "Credenciais inválidas" });

    const token = jwt.sign(
      { adminId: admin.id, adminEmail: admin.email },
      process.env.JWT_KEY!,
      { expiresIn: "1d" }
    );

    const { senha, ...adminSemSenha } = admin;
    res.json({ token, admin: adminSemSenha });
  })
);

export default router;
