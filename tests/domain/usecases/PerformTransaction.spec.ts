import { CreateUser } from '../../../src/domain/usecases/CreateUser'
import { FakeUserRepository } from '../../fakes/FakeUserRepository'
import { PerformTransaction } from '../../../src/domain/usecases/PerformTransaction'
import { User } from '../../../src/domain/models/User'
import { GetBalance } from '../../../src/domain/usecases/GetBalance'
import { FakeTransactionRepository } from '../../fakes/FakeTransactionRepository'

describe('Transaction use case', () => {
  let fakeUserRepository: FakeUserRepository
  let createUserUseCase: CreateUser
  let getBalanceUseCase: GetBalance

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository()
    createUserUseCase = new CreateUser(fakeUserRepository)
    getBalanceUseCase = new GetBalance(fakeUserRepository)

    await createUserUseCase.execute({
      username: 'debitedUser',
      password: 'V4lidPassword'
    })
    await createUserUseCase.execute({
      username: 'creditedUser',
      password: 'V4lidPassword'
    })
  })

  it('Deve realizar uma transferência', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(
      fakeUserRepository,
      fakeTransactionRepository
    )

    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User
    const creditedUserAccountId = (await fakeUserRepository.listByUsername('creditedUser')) as User

    const transaction = await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedUsername: 'creditedUser',
      value: 1500 // = R$15,00
    })

    expect(transaction).toHaveProperty('id')
    expect(transaction).toHaveProperty('debitedAccountId')
    expect(transaction).toHaveProperty('creditedAccountId')
    expect(transaction).toHaveProperty('createdAt')
    expect(transaction.value).toBe(1500)

    expect((await getBalanceUseCase.execute(debitedUserAccount.id)).balance).toBe(8500) // = R$85,00
    expect((await getBalanceUseCase.execute(creditedUserAccountId.id)).balance).toBe(11500) // = R$115,00
  })

  it('Deve retornar um erro quando o valor da transfêrencia for maior que o saldo atual', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(fakeUserRepository, fakeTransactionRepository)
    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User

    await expect(async () => {
      await performTransactionUseCase.execute({
        debitedAccountId: debitedUserAccount.accountId,
        creditedUsername: 'creditedUser',
        value: 15000 // = R$150,00
      })
    }).rejects.toThrowError('Saldo insuficiente')
  })

  it('Deve retornar um erro quando a a conta de destino for igual a conta de origem', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(
      fakeUserRepository,
      fakeTransactionRepository
    )

    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User

    await expect(async () => {
      await performTransactionUseCase.execute({
        debitedAccountId: debitedUserAccount.accountId,
        creditedUsername: 'debitedUser',
        value: 100 // = R$150,00
      })
    }).rejects.toThrowError('Conta que recebe o cash-in não pode ser igual a conta que faz o cash-out')
  })

  it('Deve retornar um erro quando o o valor a ser transferido for <= 0', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(
      fakeUserRepository,
      fakeTransactionRepository
    )

    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User

    await expect(async () => {
      await performTransactionUseCase.execute({
        debitedAccountId: debitedUserAccount.accountId,
        creditedUsername: 'creditedUser',
        value: 0 // = R$150,00
      })
    }).rejects.toThrowError('Valor da transferência deve ser maior que 0')
  })
})
