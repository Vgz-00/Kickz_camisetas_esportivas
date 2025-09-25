import { Request, Response } from "express";
import { pedidoSchema } from "../schemas/pedidoSchema";
import { pedidoModel } from "../models/pedidoModel";

export const createPedido = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = pedidoSchema.parse(req.body);
        const newPedido = await pedidoModel.create(validaSchema);
         
        return res.status(201).json(newPedido);

    } catch (error) {

         
        return res.status(400).json({error: error})
    } 
} 

export const listPedido = async (req: Request, res: Response) => {
    try {
        
        
        const findPedido = await pedidoModel.listAll();
         
        return res.status(200).json(findPedido);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listPedidosByCliente = async (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.clienteId);
        const pedidos = await pedidoModel.listByCliente(clienteId);
        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(400).json({ error });
    }
}

export const findPedidoPendente = async (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.clienteId);
        const pedido = await pedidoModel.findPendente(clienteId);
        if (!pedido) {
            return res.status(404).json({ message: "Nenhum pedido pendente encontrado." });
        }
        return res.status(200).json(pedido);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar pedido pendente" });
    }

    
}

export const finalizarPedido = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const pedidoFinalizado = await pedidoModel.updateStatus(id, "PAGO");
        return res.status(200).json(pedidoFinalizado);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao finalizar o pedido." });
    }
}