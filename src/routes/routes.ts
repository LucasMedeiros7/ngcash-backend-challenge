import { Router } from 'express'
import { makeCreateUserController } from '../factories/createUserControllerFactory'
import { makeLoginController } from '../factories/loginControllerFactory'

const routes = Router()

routes.post('/users', (request, response) => {
  const createUserController = makeCreateUserController()
  createUserController.handle(request, response).catch(console.error)
})
routes.post('/login', (request, response) => {
  const loginController = makeLoginController()
  loginController.handle(request, response).catch(console.error)
})

export { routes }
