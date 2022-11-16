import { Request, Response } from 'express';
import { Login } from '../domain/usecases/Login';

export class LoginController {
  constructor(private loginUseCase: Login) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;
    try {
      const accessToken = await this.loginUseCase.execute({ username, password });
      return response.json(accessToken);
    } catch (err) {
      return response.status(401).json({ error: err.message });
    }
  }
}
