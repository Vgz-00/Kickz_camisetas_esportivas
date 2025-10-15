import { Request, Response } from "express";
import { dashboardModel } from "../models/dashboard.Model";

export const getDashboardGerais = async (req: Request, res: Response) => {
  try {
    const dados = await dashboardModel.getGerais();
    return res.status(200).json(dados);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: "Erro ao carregar dados gerais" });
  }
};

export const getDashboardCamisasMarca = async (req: Request, res: Response) => {
  try {
    const dados = await dashboardModel.getCamisasPorMarca();
    return res.status(200).json(dados);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: "Erro ao carregar camisas por marca" });
  }
};

export const getDashboardCamisasMaisVendidas = async (req: Request, res: Response) => {
  try {
    const dados = await dashboardModel.getCamisasMaisVendidas();
    return res.status(200).json(dados);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: "Erro ao carregar camisas mais vendidas" });
  }
};