import { CreateUserController } from '../controllers/createUserController/CreateUserController'
import { CreateUser } from '../domain/usecases/createUser/CreateUser'
import { UserRepository } from '../infra/repositories/implementations/UserRepository'

export function makeCreateUserController (): CreateUserController {
  const userRepository = new UserRepository()
  const createUserUseCase = new CreateUser(userRepository)
  const createUserController = new CreateUserController(createUserUseCase)
  return createUserController
}
