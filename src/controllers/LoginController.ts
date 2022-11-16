import { Request, Response } from 'express'
import { Login } from '../domain/usecases/Login'

export class LoginController {
  constructor(private readonly loginUseCase: Login) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body
    try {
      const accessToken = await this.loginUseCase.execute({ username, password })
      return response.json(accessToken)
    } catch (err) {
      const errorCodeStatus = err.message.startsWith('Senha') === true ? 401 : 404
      return response.status(errorCodeStatus).json({ error: err.message })
    }
  }
}
