import { Request, Response } from "express";
import { adminSchema } from "../schemas/adminSchema";
import { adminModel } from "../models/admin.Model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

export const LoginAdmin = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const mensaPadrao = "Login ou senha incorretos";

  if (!email || !senha) {
    return res.status(400).json({ erro: mensaPadrao });
  }

  try {
    const admin = await adminModel.findByEmail(email);

    if (!admin) {
      return res.status(400).json({ erro: mensaPadrao });
    }

    // compara o hash da senha
    const senhaConfere = bcrypt.compareSync(senha, admin.senha);
    if (!senhaConfere) {
      // regista o log de tentativa incorreta
      await adminModel.registrarLog({
        descricao: "Tentativa de acesso ao sistema",
        complemento: `Admin: ${admin.id} - ${admin.nome}`,
        adminId: admin.id,
      });

      return res.status(400).json({ erro: mensaPadrao });
    }

    // gera token JWT
    const token = jwt.sign(
      {
        adminLogadoId: admin.id,
        adminLogadoNome: admin.nome,
        adminLogadoNivel: admin.nivel,
      },
      process.env.JWT_KEY as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      nivel: admin.nivel,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: "Erro ao efetuar login" });
  }
};
