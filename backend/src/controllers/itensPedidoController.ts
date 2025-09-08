import { Request, Response } from "express";
import { itensPedidoSchema } from "../schemas/itemPedidoSchema";
import { itensPedidoModel } from "../models/itensPedidoModel";
import { error } from "console";

export const createItemPedido = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = itensPedidoSchema.parse(req.body);
        const newItensPedido = await itensPedidoModel.create(validaSchema);
         
        return res.status(201).json(newItensPedido);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listItensPedido = async (req: Request, res: Response) => {
    try {
        
        
        const findItensPedido = await itensPedidoModel.listAll();
         
        return res.status(200).json(findItensPedido);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 


export const updateItensPedido = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = itensPedidoSchema.partial().parse(req.body);
        const updateditens = await itensPedidoModel.uptade(id, data);
        return res.json(updateditens);
    } catch (error) {
        return res.status(400).json({ error: error})
    }
};

export const deleteItensPedido = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await itensPedidoModel.delete(id);
        return res.status(204).send();
    } catch {
        return res.status(500).json({ error: error });
        
    }
}