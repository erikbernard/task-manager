import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// Erro customizada para ter controle sobre o status code.
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  // O parâmetro `next` é necessário aqui, mesmo não sendo usado,
  // para que o Express o reconheça como um middleware de erro.
  next: NextFunction
) {
  // Erros conhecidos da aplicação
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  // Erros de validação do Zod
  if (error instanceof ZodError) {
    return response.status(400).json({
      status: "error",
      message: "Dados inválidos.",
      issues: error.flatten().fieldErrors,
    });
  }

  // Para erros inesperados.
  console.error(error);

  // Resposta genérica para outros tipos de erros.
  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor.",
  });
}
