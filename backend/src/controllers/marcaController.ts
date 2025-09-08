import { Request, Response } from "express";
import { marcaSchema } from "../schemas/marcaSchema";
import { marcaModel } from "../models/marcaModel";
import { error } from "console";

export const createMarca = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = marcaSchema.parse(req.body);
        const newMarca = await marcaModel.create(validaSchema);
         
        return res.status(201).json(newMarca);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listMarca = async (req: Request, res: Response) => {
    try {
        
        
        const findMarca = await marcaModel.listAll();
         
        return res.status(200).json(findMarca);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
};


export const updateMarca = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = marcaSchema.partial().parse(req.body);
        const updatedMarca = await marcaModel.uptade(id, data);
        return res.json(updatedMarca);
    } catch (error) {
        return res.status(400).json({ error: error})
    }
};

export const deleteMarca = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await marcaModel.delete(id);
        return res.status(204).send();
    } catch {
        return res.status(500).json({ error: error });
        ;
    }
}