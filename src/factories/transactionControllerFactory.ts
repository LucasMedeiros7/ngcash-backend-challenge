import { TransactionController } from '../controllers/TransactionController'
import { PerformTransaction } from '../domain/usecases/PerformTransaction'
import { TransactionRepository } from '../infra/repositories/implementations/TransactionRepository'
import { UserRepository } from '../infra/repositories/implementations/UserRepository'

export function makeTransactionController (): TransactionController {
  const userRepository = new UserRepository()
  const transactionRepository = new TransactionRepository()
  const performTransactionUseCase = new PerformTransaction(userRepository, transactionRepository)
  const transactionController = new TransactionController(performTransactionUseCase)
  return transactionController
}
