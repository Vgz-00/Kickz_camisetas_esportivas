import { Router, Response } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../utils/ayncHandler";
import { verificaTokenCliente, ClienteReq } from "../middlewares/verificaTokenCliente";
import { verificaTokenAdmin, AdminReq } from "../middlewares/verificaTokenAdmin";

const router = Router();

const STATUS_VALIDOS = ["PENDENTE", "PAGO", "ENVIADO", "CANCELADO"] as const;
type PedidoStatus = typeof STATUS_VALIDOS[number];


router.get(
  "/pendente",
  verificaTokenCliente,
  asyncHandler(async (req: ClienteReq, res: Response) => {
    const clienteId = req.cliente?.clienteId;

    if (!clienteId) return res.status(401).json({ erro: "Cliente não autenticado" });

    const pedido = await prisma.pedido.findFirst({
      where: { clienteId, status: "PENDENTE" },
      include: { itens: { include: { camisa: true } } },
    });

    if (!pedido) return res.status(404).json({ erro: "Nenhum pedido pendente encontrado" });

    res.json(pedido);
  })
);


router.get(
  "/meus",
  verificaTokenCliente,
  asyncHandler(async (req: ClienteReq, res: Response) => {
    const clienteId = req.cliente?.clienteId;

    if (!clienteId) return res.status(401).json({ erro: "Cliente não autenticado" });

    const pedidos = await prisma.pedido.findMany({
      where: { clienteId },
      orderBy: { createdAt: "desc" }, // Listar os mais recentes primeiro
      include: { itens: { include: { camisa: true } } },
    });

    res.json(pedidos);
  })
);


router.post(
  "/",
  verificaTokenCliente,
  asyncHandler(async (req: ClienteReq, res: Response) => {
    const clienteId = req.cliente?.clienteId;
    if (!clienteId) return res.status(401).json({ erro: "Cliente não autenticado" });

    const pedidoExistente = await prisma.pedido.findFirst({
      where: { clienteId, status: "PENDENTE" },
    });

    if (pedidoExistente)
      return res.status(400).json({ erro: "Já existe um pedido pendente" });

    const novoPedido = await prisma.pedido.create({
      data: { clienteId, status: "PENDENTE" },
    });

    res.status(201).json(novoPedido);
  })
);

 
router.post(
  "/:id/item",
  verificaTokenCliente,
  asyncHandler(async (req: ClienteReq, res: Response) => {
    const pedidoId = Number(req.params.id);
    const clienteId = req.cliente?.clienteId;
    const camisaId = Number(req.body.camisaId);
    const quantidade = Number(req.body.quantidade);

    if (!clienteId) return res.status(401).json({ erro: "Cliente não autenticado" });

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido || pedido.clienteId !== clienteId || pedido.status !== "PENDENTE") {
      return res.status(400).json({ erro: "Pedido inválido ou já confirmado" });
    }

    const camisa = await prisma.camisa.findUnique({ where: { id: camisaId } });
    if (!camisa) return res.status(404).json({ erro: "Camisa não encontrada" });

    const itemExistente = await prisma.itensPedido.findFirst({
      where: { pedidoId, camisaId },
    });

    if (itemExistente) {
      
      await prisma.itensPedido.update({
        where: { id: itemExistente.id },
        data: { quantidade: itemExistente.quantidade + quantidade },
      });
    } else {
      
      await prisma.itensPedido.create({
        data: {
          pedidoId,
          camisaId,
          quantidade,
          preco: camisa.preco,
        },
      });
    }

    res.status(201).json({ mensagem: "Item adicionado ao carrinho", pedidoId });
  })
);

 
router.patch(
  "/:id/confirmar",
  verificaTokenCliente,
  asyncHandler(async (req: ClienteReq, res: Response) => {
    const pedidoId = Number(req.params.id);
    const clienteId = req.cliente?.clienteId;

    if (!clienteId) return res.status(401).json({ erro: "Cliente não autenticado" });

    const pedido = await prisma.pedido.findFirst({
      where: { id: pedidoId, clienteId, status: "PENDENTE" },
      include: { itens: { include: { camisa: true } } },
    });

    if (!pedido) return res.status(400).json({ erro: "Pedido inválido ou já confirmado" });

    const atualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status: "PAGO" }, 
      include: { itens: { include: { camisa: true } } },
    });

    res.json({ mensagem: "Pedido confirmado com sucesso!", pedido: atualizado });
  })
);

 
router.get(
  "/admin",
  verificaTokenAdmin,
  asyncHandler(async (_req: AdminReq, res: Response) => {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: { select: { id: true, nome: true, email: true } },
        itens: { include: { camisa: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    res.json(pedidos);
  })
);


router.patch(
  "/status/:id",
  verificaTokenAdmin,
  asyncHandler(async (req: AdminReq, res: Response) => {
    const pedidoId = Number(req.params.id);
    const { status } = req.body;

    if (!status || !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ 
        error: `Status inválido. Status permitidos: ${STATUS_VALIDOS.join(', ')}.` 
      });
    }

    const pedidoExistente = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedidoExistente) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status: status as PedidoStatus },
      include: { itens: { include: { camisa: true } }, cliente: true },
    });

    res.json({ message: `Status do pedido ${pedidoId} atualizado para ${status}.`, pedido: pedidoAtualizado });
  })
);

export default router;
