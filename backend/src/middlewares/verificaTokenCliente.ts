import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenClienteType = {
  clienteId: string;
  clienteEmail: string;
};

export type ClienteReq = Request & { cliente?: TokenClienteType };

export function verificaTokenCliente(
  req: ClienteReq,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ erro: "Token não informado" });

  const token = authorization.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as TokenClienteType;
    req.cliente = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
