import { Router } from 'express'
import { loginRoutes } from './login.routes'
import { usersRoutes } from './users.routes'

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/login', loginRoutes)

export { routes }
