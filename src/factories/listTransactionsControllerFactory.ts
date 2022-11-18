import { ListTransactionsController } from '../controllers/ListTransactionsController'
import { ListTransactions } from '../domain/usecases/ListTransactions'
import { TransactionRepository } from '../infra/repositories/implementations/TransactionRepository'

export function makeListTransactionsController (): ListTransactionsController {
  const transactionRepository = new TransactionRepository()
  const listTransactionsUseCase = new ListTransactions(transactionRepository)
  const listTransactionsController = new ListTransactionsController(listTransactionsUseCase)
  return listTransactionsController
}
