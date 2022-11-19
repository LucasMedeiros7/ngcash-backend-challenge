import { CreateUser } from '../../../src/domain/usecases/CreateUser'
import { FakeUserRepository } from '../../fakes/FakeUserRepository'
import { PerformTransaction } from '../../../src/domain/usecases/PerformTransaction'
import { User } from '../../../src/domain/models/User'
import { FakeTransactionRepository } from '../../fakes/FakeTransactionRepository'
import { ListTransactionsByDate } from '../../../src/domain/usecases/ListTransactionsByDate'

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
