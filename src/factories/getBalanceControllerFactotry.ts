import { GetBalanceController } from '../controllers/GetBalanceController'
import { GetBalance } from '../domain/usecases/GetBalance'
import { UserRepository } from '../infra/repositories/implementations/UserRepository'

export function makeGetBalanceController (): GetBalanceController {
  const userRepository = new UserRepository()
  const getBalanceUseCase = new GetBalance(userRepository)
  const getBalanceController = new GetBalanceController(getBalanceUseCase)
  return getBalanceController
}
