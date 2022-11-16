import { LoginController } from '../controllers/LoginController'
import { Login } from '../domain/usecases/Login'
import { UserRepository } from '../infra/repositories/UserRepository'

export function makeLoginController (): LoginController {
  const userRepository = new UserRepository()
  const loginUseCase = new Login(userRepository)
  const loginController = new LoginController(loginUseCase)
  return loginController
}
