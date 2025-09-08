import { Request, Response } from "express";
import { logSchema } from "../schemas/logSchema";
import { logModel } from "../models/logModel";

export const createLog = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = logSchema.parse(req.body);
        const newLog = await logModel.create(validaSchema);
         
        return res.status(201).json(newLog);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listLog = async (req: Request, res: Response) => {
    try {
        
        
        const findLog = await logModel.listAll();
         
        return res.status(200).json(findLog);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 