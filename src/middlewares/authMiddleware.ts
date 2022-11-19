import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export interface TokenPayload {
  userId: string
  accountId: string
  iat: number
  exp: number
}

export function authMiddleware (request: Request, response: Response, next: NextFunction): void {
  const authorization = request.headers.authorization as string
  const token = authorization.split(' ')[1]
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const data = jwt.verify(token, secret)
    const { userId, accountId } = data as TokenPayload

    request.user = {
      id: userId,
      accountId
    }
    return next()
  } catch {
    response.status(403).json({ error: 'Usuário não autorizado' })
  }
}
