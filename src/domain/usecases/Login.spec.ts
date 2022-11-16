import jwt from 'jsonwebtoken'
import { Login } from './Login'
import { CreateUser } from './CreateUser'
import { FakeRepository } from './CreateUser.spec'
import dotenv from 'dotenv'
dotenv.config()

interface TokenPayload {
  id: string
  iat: number
  exp: number
}

describe('Login use case', () => {
  let fakeRepository: FakeRepository
  let createUserUseCase: CreateUser

  beforeEach(() => {
    fakeRepository = new FakeRepository()
    createUserUseCase = new CreateUser(fakeRepository)
  })

  it('Deve retornar um token jwt quando o login for efetuado com sucesso', async () => {
    const userPayload = {
      username: 'fakename',
      password: 'V4lidPassword'
    }
    const user = await createUserUseCase.execute(userPayload)
    const loginUseCase = new Login(fakeRepository)

    const { accessToken } = await loginUseCase.execute(userPayload)

    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const token = jwt.verify(accessToken, secret) as TokenPayload

    expect(token).toHaveProperty('iat')
    expect(token).toHaveProperty('exp')
    expect(token.id).toBe(user.id)
  })

  it('Deve retornar um erro caso a senha esteja errada', async () => {
    const userPayload = {
      username: 'fakename2',
      password: 'V4lidPassword'
    }
    await createUserUseCase.execute(userPayload)
    const loginUseCase = new Login(fakeRepository)

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
    const loginUseCase = new Login(fakeRepository)

    await expect(async () => {
      await loginUseCase.execute({
        username: 'invalidName',
        password: 'V4lidPassword'
      })
    }).rejects.toThrowError()
  })
})
