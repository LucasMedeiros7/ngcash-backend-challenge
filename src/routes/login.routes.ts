import { Router } from 'express'
import { makeLoginController } from '../factories/loginControllerFactory'

const loginRoutes = Router()

loginRoutes.post('/', (request, response) => {
  const loginController = makeLoginController()
  loginController.handle(request, response).catch(console.error)
})

export { loginRoutes }
