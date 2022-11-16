import { Router } from 'express'
import { makeCreateUserController } from '../factories/createUserControllerFactory'

const usersRoutes = Router()

usersRoutes.post('/', (request, response) => {
  const createUserController = makeCreateUserController()
  createUserController.handle(request, response).catch(console.error)
})

export { usersRoutes }
