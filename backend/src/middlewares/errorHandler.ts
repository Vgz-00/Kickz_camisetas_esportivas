import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "Validação falhou",
      detalhes: err.issues.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      })),
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ erro: "Token inválido" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ erro: "Token expirado" });
  }

  res.status(500).json({ erro: "Erro interno no servidor" });
}
