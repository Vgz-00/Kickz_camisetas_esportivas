import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { clienteSchema, loginSchema } from "../schemas/clienteSchema";
import { asyncHandler } from "../utils/ayncHandler";

const router = Router();
const prisma = new PrismaClient();



router.post(
  "/cadastrar",
  asyncHandler(async (req, res) => {
    const dados = clienteSchema.parse(req.body);
    const senhaHash = await bcrypt.hash(dados.senha, 12);

    const novoCliente = await prisma.cliente.create({
      data: { ...dados, senha: senhaHash },
    });

    res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso",
      cliente: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        email: novoCliente.email,
      },
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const dados = loginSchema.parse(req.body);

    const cliente = await prisma.cliente.findUnique({
      where: { email: dados.email },
    });

    if (!cliente) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaOk = await bcrypt.compare(dados.senha, cliente.senha);
    if (!senhaOk) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    
    const token = jwt.sign(
      { clienteId: cliente.id, clienteEmail: cliente.email },
      process.env.JWT_KEY!,
      { expiresIn: "1d" }
    );

    res.json({
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
      token,
    });
  })
);

export default router;
