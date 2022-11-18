import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { PerformTransaction } from './PerformTransaction'
import { User } from '../models/User'
import { FakeTransactionRepository } from '../../infra/repositories/in-memory/FakeTransactionRepository'
import { ListTransactions } from './ListTransactions'
import { ListTransactionsByType } from './ListTransactionsByType'

describe('List transactions by type use case', () => {
  let fakeUserRepository: FakeUserRepository
  let createUserUseCase: CreateUser

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository()
    createUserUseCase = new CreateUser(fakeUserRepository)

    await createUserUseCase.execute({
      username: 'debitedUser',
      password: 'V4lidPassword'
    })
    await createUserUseCase.execute({
      username: 'creditedUser',
      password: 'V4lidPassword'
    })
  })

  it('should only list cash-out type transactions', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(fakeUserRepository, fakeTransactionRepository)
    const listTransactionsUseCase = new ListTransactions(fakeTransactionRepository)
    const listTransactionsByTypeUseCase = new ListTransactionsByType(fakeTransactionRepository)

    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User
    const creditedUserAccountId = (await fakeUserRepository.listByUsername('creditedUser')) as User

    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })
    await performTransactionUseCase.execute({
      debitedAccountId: creditedUserAccountId.accountId,
      creditedAccountId: debitedUserAccount.accountId,
      value: 1500
    })
    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })

    const allTransactions = await listTransactionsUseCase.execute(debitedUserAccount.accountId)
    const cashOutTransactions = await listTransactionsByTypeUseCase.execute({ accountId: debitedUserAccount.accountId, type: 'cash-out' })

    expect(cashOutTransactions).toHaveLength(2)
    expect(allTransactions).toHaveLength(3)
  })

  it('should only list cash-in type transactions', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(fakeUserRepository, fakeTransactionRepository)
    const listTransactionsUseCase = new ListTransactions(fakeTransactionRepository)
    const listTransactionsByTypeUseCase = new ListTransactionsByType(fakeTransactionRepository)

    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User
    const creditedUserAccountId = (await fakeUserRepository.listByUsername('creditedUser')) as User

    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })
    await performTransactionUseCase.execute({
      debitedAccountId: creditedUserAccountId.accountId,
      creditedAccountId: debitedUserAccount.accountId,
      value: 1500
    })

    const allTransactions = await listTransactionsUseCase.execute(debitedUserAccount.accountId)
    const cashOutTransactions = await listTransactionsByTypeUseCase.execute({
      accountId: debitedUserAccount.accountId,
      type: 'cash-in'
    })

    expect(cashOutTransactions).toHaveLength(1)
    expect(allTransactions).toHaveLength(2)
  })
})
