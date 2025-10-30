import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenAdminType = {
  adminId: string;
  adminEmail: string;
};

export type AdminReq = Request & { admin?: TokenAdminType };

export function verificaTokenAdmin(
  req: AdminReq,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ erro: "Token não informado" });

  const token = authorization.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as TokenAdminType;
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
