import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { CreateUser } from './CreateUser'
import { GetBalance } from './GetBalance'

describe('Get Balance Use Case', () => {
  let fakeUserRepository: FakeUserRepository
  let createUserUseCase: CreateUser

  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository()
    createUserUseCase = new CreateUser(fakeUserRepository)
  })

  it('Deve retornar o saldo do usuário', async () => {
    const user = await createUserUseCase.execute({
      username: 'fakename',
      password: '123PasswordValido'
    })
    const getBalanceUseCase = new GetBalance(fakeUserRepository)

    const currentBalance = await getBalanceUseCase.execute(user.id)

    expect(currentBalance).toMatchObject({
      username: 'fakename',
      balance: 10000
    })
  })

  it('Deve retornar um erro caso o username passado não exista', async () => {
    await createUserUseCase.execute({
      username: 'fakename2',
      password: '123PasswordValido'
    })
    const getBalanceUseCase = new GetBalance(fakeUserRepository)

    await expect(
      async () => await getBalanceUseCase.execute('invalidFakeName')
    ).rejects.toThrowError()
  })
})
