import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { PerformTransaction } from './PerformTransaction'
import { User } from '../models/User'
import { FakeTransactionRepository } from '../../infra/repositories/in-memory/FakeTransactionRepository'
import { ListTransactions } from './ListTransactions'

describe('List transactions use case', () => {
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

  it('Deve deve listar apenas as transferências que o usuário participou', async () => {
    const fakeTransactionRepository = new FakeTransactionRepository()
    const performTransactionUseCase = new PerformTransaction(fakeUserRepository, fakeTransactionRepository)
    const listTransactionsUseCase = new ListTransactions(fakeTransactionRepository)
    const debitedUserAccount = (await fakeUserRepository.listByUsername('debitedUser')) as User
    const creditedUserAccountId = (await fakeUserRepository.listByUsername('creditedUser')) as User

    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })
    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: creditedUserAccountId.accountId,
      value: 1500
    })
    const otherUser = await createUserUseCase.execute({
      username: 'forTestTransfer',
      password: 'V4lidPassword'
    })
    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: otherUser.accountId,
      value: 1500
    })

    const transactionsOfOtherUser = await listTransactionsUseCase.execute(otherUser.accountId)
    const transactionsOfCreditedUser = await listTransactionsUseCase.execute(creditedUserAccountId.accountId)
    const transactionsOfDebitedUser = await listTransactionsUseCase.execute(debitedUserAccount.accountId)

    expect(transactionsOfOtherUser).toHaveLength(1)
    expect(transactionsOfCreditedUser).toHaveLength(2)
    expect(transactionsOfDebitedUser).toHaveLength(3)
  })
})
