import { Request, Response } from "express";
import { clienteSchema, loginSchema } from "../schemas/clienteSchema";
import { clienteModel } from "../models/clienteModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createCliente = async (req: Request, res: Response) => {
    try {
        
        const validaSchema = clienteSchema.parse(req.body);
        
        const senhaHash = await bcrypt.hash(validaSchema.senha, 12)
        
        const newCliente = await clienteModel.create({
            ...validaSchema,
            senha: senhaHash,
        });
         
        return res.status(201).json(newCliente);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 

export const listCliente = async (req: Request, res: Response) => {
    try {
        
        
        const findCliente = await clienteModel.listAll();
         
        return res.status(200).json(findCliente);

    } catch (error) {
         
        return res.status(400).json({error: error})
    } 
} 


export const loginCliente = async (req: Request, res: Response) => {
    try {

        const { email, senha } = loginSchema.parse(req.body);

        const cliente = await clienteModel.findByEmail(email);
        if (!cliente) {
            return res.status(401).json({error: "Email ou senha invalidos"});
        }

        const senhaValida = await bcrypt.compare(senha, cliente.senha);
        if (!senhaValida) {
            return res.status(401).json({error: "Email ou senha invalidos"});
        }
        
        const token = jwt.sign(
            {id: cliente.id, email: cliente.email },
            process.env.JWT_KEY as string,
            {expiresIn: "3h"}
        );

        return res.status(200).json({message: "Login feito com sucesso", token})
    } catch (error) {
        return res.status(400).json({error: error})        
    }
};