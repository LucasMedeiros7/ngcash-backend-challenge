import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { PerformTransaction } from './PerformTransaction'
import { User } from '../models/User'
import { FakeTransactionRepository } from '../../infra/repositories/in-memory/FakeTransactionRepository'
import { ListTransactionsByDate } from './ListTransactionsByDate'

describe('List transactions by date use case', () => {
  let fakeUserRepository: FakeUserRepository
  let createUserUseCase: CreateUser

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository()
    createUserUseCase = new CreateUser(fakeUserRepository)

    await createUserUseCase.execute({
      username: 'fakedebitedUser',
      password: 'V4lidPassword'
    })
    await createUserUseCase.execute({
      username: 'fakecreditedUser',
      password: 'V4lidPassword'
    })
  })

  it('should list transactions by date', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(fakeUserRepository, fakeTransactionRepository)

    const debitedUserAccount = (await fakeUserRepository.listByUsername('fakedebitedUser')) as User
    const creditedUserAccountId = (await fakeUserRepository.listByUsername('fakecreditedUser')) as User

    const listTransactionsByDateUseCase = new ListTransactionsByDate(fakeTransactionRepository)

    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })

    const transactionsToday = await listTransactionsByDateUseCase.execute({
      accountId: debitedUserAccount.accountId,
      date: '19/11/2022'
    })
    const transactionsOtherDay = await listTransactionsByDateUseCase.execute({
      accountId: debitedUserAccount.accountId,
      date: '11/11/2022'
    })

    expect(transactionsToday).toHaveLength(1)
    expect(transactionsOtherDay).toHaveLength(0)
  })
})
