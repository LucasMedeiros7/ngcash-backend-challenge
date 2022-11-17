import jwt from 'jsonwebtoken'
import { Login } from './Login'
import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { TokenPayload } from '../../middlewares/authMiddleware'
import dotenv from 'dotenv'
dotenv.config()

describe('Login use case', () => {
  let fakeUserRepository: FakeUserRepository
  let createUserUseCase: CreateUser

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository()
    createUserUseCase = new CreateUser(fakeUserRepository)
  })

  it('Deve retornar um token jwt quando o login for efetuado com sucesso', async () => {
    const userPayload = {
      username: 'fakename',
      password: 'V4lidPassword'
    }
    const user = await createUserUseCase.execute(userPayload)
    const loginUseCase = new Login(fakeUserRepository)

    const { accessToken } = await loginUseCase.execute(userPayload)

    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const token = jwt.verify(accessToken, secret) as TokenPayload

    expect(token).toHaveProperty('iat')
    expect(token).toHaveProperty('exp')
    expect(token.userId).toBe(user.id)
  })

  it('Deve retornar um erro caso a senha esteja errada', async () => {
    const userPayload = {
      username: 'fakename2',
      password: 'V4lidPassword'
    }
    await createUserUseCase.execute(userPayload)
    const loginUseCase = new Login(fakeUserRepository)

    await expect(async () => {
      await loginUseCase.execute({
        username: 'fakename2',
        password: 'invalid'
      })
    }).rejects.toThrowError()
  })

  it('Deve retornar um erro caso o username esteja errado', async () => {
    const userPayload = {
      username: 'fakename3',
      password: 'V4lidPassword'
    }
    await createUserUseCase.execute(userPayload)
    const loginUseCase = new Login(fakeUserRepository)

    await expect(async () => {
      await loginUseCase.execute({
        username: 'invalidName',
        password: 'V4lidPassword'
      })
    }).rejects.toThrowError()
  })
})
