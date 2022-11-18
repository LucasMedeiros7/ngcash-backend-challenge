import { CreateUserController } from '../controllers/CreateUserController'
import { CreateUser } from '../domain/usecases/CreateUser'
import { UserRepository } from '../infra/repositories/implementations/UserRepository'

export function makeCreateUserController (): CreateUserController {
  const userRepository = new UserRepository()
  const createUserUseCase = new CreateUser(userRepository)
  const createUserController = new CreateUserController(createUserUseCase)
  return createUserController
}
