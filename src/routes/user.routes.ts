import { Router } from 'express'
import { makeCreateUserController } from '../factories/createUserControllerFactory'
import { makeGetBalanceController } from '../factories/getBalanceControllerFactotry'
import { authMiddleware } from '../middlewares/authMiddleware'

const userRoutes = Router()

userRoutes.post('/', (request, response) => {
  const createUserController = makeCreateUserController()
  createUserController.handle(request, response).catch(console.error)
})
userRoutes.get('/balance', authMiddleware, (request, response) => {
  const getBalanceController = makeGetBalanceController()
  getBalanceController.handle(request, response).catch(console.error)
})

export { userRoutes }
