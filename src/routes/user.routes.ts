import { Router } from 'express'
import { makeCreateUserController } from '../factories/createUserControllerFactory'

const userRoutes = Router()

userRoutes.post('/', (request, response) => {
  const createUserController = makeCreateUserController()
  createUserController.handle(request, response).catch(console.error)
})

export { userRoutes }
