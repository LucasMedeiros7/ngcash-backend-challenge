import { Router } from 'express'
import { makeListTransactionsByTypeController } from '../factories/listTransactionsByTypeController'
import { makeListTransactionsController } from '../factories/listTransactionsControllerFactory'
import { makeTransactionController } from '../factories/transactionControllerFactory'

const transactionRoutes = Router()
const transactionController = makeTransactionController()
const listTransactionsController = makeListTransactionsController()
const listTransactionsByTypeController = makeListTransactionsByTypeController()

transactionRoutes.post('/', (request, response) => {
  transactionController.handle(request, response).catch(console.error)
})
transactionRoutes.get('/', (request, response) => {
  listTransactionsController.handle(request, response).catch(console.error)
})
transactionRoutes.get('/cash-out', (request, response) => {
  request.transactionType = 'cash-out'
  listTransactionsByTypeController.handle(request, response).catch(console.error)
})
transactionRoutes.get('/cash-in', (request, response) => {
  request.transactionType = 'cash-in'
  listTransactionsByTypeController.handle(request, response).catch(console.error)
})

export { transactionRoutes }
