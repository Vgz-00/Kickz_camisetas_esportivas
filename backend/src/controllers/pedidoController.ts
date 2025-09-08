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

