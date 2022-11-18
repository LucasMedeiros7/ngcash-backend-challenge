import { ListTransactionsByTypeController } from '../controllers/ListTransactionsByTypeController'
import { ListTransactionsByType } from '../domain/usecases/ListTransactionsByType'
import { TransactionRepository } from '../infra/repositories/implementations/TransactionRepository'

export function makeListTransactionsByTypeController (): ListTransactionsByTypeController {
  const transactionRepository = new TransactionRepository()
  const listTransactionsByTypesUseCase = new ListTransactionsByType(transactionRepository)
  const listTransactionsByTypeController = new ListTransactionsByTypeController(listTransactionsByTypesUseCase)
  return listTransactionsByTypeController
}
