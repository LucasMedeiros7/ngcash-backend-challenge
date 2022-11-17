import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export interface TokenPayload {
  userId: string
  iat: number
  exp: number
}

export function authMiddleware (
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authorization = request.headers.authorization as string
  const token = authorization.split(' ')[1]
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const data = jwt.verify(token, secret)
    const { userId } = data as TokenPayload

    request.userId = userId
    return next()
  } catch {
    response.status(403).json({ error: 'Usuário não autorizado' })
  }
}
