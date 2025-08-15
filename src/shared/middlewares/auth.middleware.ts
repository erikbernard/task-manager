import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from './../interfaces/IAuthenticatedRequest';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [, token] = authorization.split(' ');

  try {
    const data = jwt.verify(token, env.JWT_SECRET);
    const { id } = data as TokenPayload;
    //muito problema
    (req as unknown as AuthenticatedRequest).userId = id;

    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}
