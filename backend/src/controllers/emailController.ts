import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../services/emailService";

const prisma = new PrismaClient();

export const sendEmailConfirmacao = async (req: Request, res: Response) => {
  try {
    const { pedidoId } = req.params;

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) },
      include: {
        cliente: true,
        itens: {
          include: { camisa: true },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    const itensHtml = pedido.itens
      .map(
        (item) => `
          <li>
            ${item.quantidade}x ${item.camisa.modelo} — €${item.preco}
          </li>`
      )
      .join("");

    const html = `
      <h2>Confirmação do seu pedido #${pedido.id}</h2>
      <p>Olá ${pedido.cliente.nome},</p>
      <p>O seu pedido foi recebido com sucesso! ⚽</p>
      <ul>${itensHtml}</ul>
      <p>Status atual: <strong>${pedido.status}</strong></p>
      <p>Obrigado por comprar na <b>Loja de Camisas</b>!</p>
    `;

    await sendEmail(pedido.cliente.email, "Confirmação do seu pedido", html);

    return res.status(200).json({ mensagem: "E-mail de confirmação enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao enviar e-mail" });
  }
};