import { Request, Response } from "express";
import { camisaSchema } from "../schemas/camisaSchema";
import { camisaModel } from "../models/camisaModel";
import { error } from "console";

export const createCamisa = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = camisaSchema.parse(req.body);
        const newCamisa = await camisaModel.create(validaSchema);
         
        return res.status(201).json(newCamisa);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listcamisa = async (req: Request, res: Response) => {
    try {
        
        
        const findCamisa = await camisaModel.listAll();
         
        return res.status(200).json(findCamisa);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
};

export const updateCamisa = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = camisaSchema.partial().parse(req.body);
        const updatedCamisa = await camisaModel.uptade(id, data);
        return res.json(updatedCamisa);
    } catch (error) {
        return res.status(400).json({ error: error})
    }
};

export const deleteCamisa = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await camisaModel.delete(id);
        return res.status(204).send();
    } catch {
        return res.status(500).json({ error: error });
        
    }
}


export const searchCamisa = async (req: Request, res: Response) => {
    try {
        const { termo } = req.params;
        const termoNumero = Number(termo);

        if (isNaN(termoNumero)) {
            
            const camisas = await camisaModel.search({
                OR: [
                    { modelo: { contains: termo, mode: "insensitive" } },
                    { marca: { nome: { equals: termo, mode: "insensitive" } } }
                ]
            });
            return res.status(200).json(camisas);
        }

        if (termoNumero <= 3000) {
           
            const camisas = await camisaModel.search({
                ano: termoNumero
            });
            return res.status(200).json(camisas);
        }

        const camisas = await camisaModel.search({
            preco: { lte: termoNumero }
        });
        return res.status(200).json(camisas);

    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const getCamisaById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const camisa = await camisaModel.findById(id);
        if (!camisa) {
            return res.status(404).json({ message: "Camisa não encontrada." });
        }
        return res.status(200).json(camisa);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar a camisa." });
    }
}