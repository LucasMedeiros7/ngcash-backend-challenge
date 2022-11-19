import { ListTransactionsByDateController } from '../controllers/ListTransactionsByDateController'
import { ListTransactionsByDate } from '../domain/usecases/ListTransactionsByDate'
import { TransactionRepository } from '../infra/repositories/implementations/TransactionRepository'

export function makeListTransactionsByDateController (): ListTransactionsByDateController {
  const transactionRepository = new TransactionRepository()
  const listTransactionsByDateUseCase = new ListTransactionsByDate(transactionRepository)
  const listTransactionsByDateController = new ListTransactionsByDateController(listTransactionsByDateUseCase)
  return listTransactionsByDateController
}
