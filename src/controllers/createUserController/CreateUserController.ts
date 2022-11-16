import { Request, Response } from 'express';
import { CreateUser } from '../../domain/usecases/createUser/CreateUser';

class CreateUserController {
  constructor(private createUserUseCase: CreateUser) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;
    try {
      const user = await this.createUserUseCase.execute({ username, password });
      return response.status(201).json({ ...user, password: undefined });
    } catch (err) {
      return response.status(400).json({ erro: err.message });
    }
  }
}

export { CreateUserController };
