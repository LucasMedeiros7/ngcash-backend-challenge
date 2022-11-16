import { Request, Response } from 'express';
import { CreateUser } from '../domain/usecases/CreateUser';

class CreateUserController {
  constructor(private createUserUseCase: CreateUser) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;
    try {
      const user = await this.createUserUseCase.execute({ username, password });
      return response.status(201).json({ ...user, password: undefined });
    } catch (err) {
      let errorCodeStatus = err.message.startsWith('Usuário') ? 409 : 422
      return response.status(errorCodeStatus).json({ error: err.message });
    }
  }
}

export { CreateUserController };
