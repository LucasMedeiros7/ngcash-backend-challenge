import { Router } from 'express'
import { loginRoutes } from './login.routes'
import { userRoutes } from './user.routes'

const routes = Router()
routes.use('/users', userRoutes)
routes.use('/login', loginRoutes)

export { routes }
