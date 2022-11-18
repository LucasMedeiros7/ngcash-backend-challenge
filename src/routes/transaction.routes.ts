import { Router } from 'express'
import { makeTransactionController } from '../factories/transactionControllerFactory'
import { authMiddleware } from '../middlewares/authMiddleware'

const transactionRoutes = Router()

transactionRoutes.post('/', authMiddleware, (request, response) => {
  const transactionController = makeTransactionController()
  transactionController.handle(request, response).catch(console.error)
})

export { transactionRoutes }
