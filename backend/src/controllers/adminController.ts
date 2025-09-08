import { Request, Response } from "express";
import { adminSchema } from "../schemas/adminSchema";
import { adminModel } from "../models/adminModel";


export const createAdmin = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = adminSchema.parse(req.body);
        const newAdmin = await adminModel.create(validaSchema);
         
        return res.status(201).json(newAdmin);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listAdmin = async (req: Request, res: Response) => {
    try {
        
        
        const findAdmin = await adminModel.listAll();
         
        return res.status(200).json(findAdmin);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 