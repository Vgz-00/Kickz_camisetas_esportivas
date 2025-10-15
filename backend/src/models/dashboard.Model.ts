// src/models/dashboard.Model.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dashboardModel = {
  async getGerais() {
    const clientes = await prisma.cliente.count();
    const pedidos = await prisma.pedido.count();
    const camisas = await prisma.camisa.count();

    const vendas = await prisma.itensPedido.aggregate({
      _sum: { preco: true },
      where: { pedido: { status: "PAGO" } },
    });

    return {
      clientes,
      pedidos,
      camisas,
      totalVendas: vendas._sum.preco ?? 0,
    };
  },

  async getCamisasPorMarca() {
    const marcas = await prisma.marca.findMany({
      select: {
        nome: true,
        _count: { select: { camisa: true } },
      },
    });

    return marcas
      .filter((m) => m._count.camisa > 0)
      .map((m) => ({
        marca: m.nome,
        num: m._count.camisa,
      }));
  },


  async getCamisasMaisVendidas() {
    const ranking = await prisma.itensPedido.groupBy({
      by: ["camisaId"],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: "desc" } },
      take: 5,
    });

    const camisas = await Promise.all(
      ranking.map(async (item) => {
        const camisa = await prisma.camisa.findUnique({
          where: { id: item.camisaId },
          select: { modelo: true, foto: true },
        });

        return {
          camisaId: item.camisaId,
          modelo: camisa?.modelo ?? "Desconhecido",
          foto: camisa?.foto ?? "",
          quantidadeVendida: item._sum.quantidade,
        };
      })
    );

    return camisas;
  },
};
