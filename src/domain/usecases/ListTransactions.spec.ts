import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'
import { PerformTransaction } from './PerformTransaction'
import { User } from '../models/User'
import { FakeTransactionRepository } from '../../infra/repositories/in-memory/FakeTransactionRepository'
import { ListTransactions } from './ListTransactions'

describe('Transaction use case', () => {
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
    const performTransactionUseCase = new PerformTransaction(
      fakeUserRepository,
      fakeTransactionRepository
    )
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


    const otherTransaction = await createUserUseCase.execute({
      username: 'forTestTransfer',
      password: 'V4lidPassword'
    })
    await performTransactionUseCase.execute({
      debitedAccountId: debitedUserAccount.accountId,
      creditedAccountId: otherTransaction.accountId,
      value: 1500
    })

    const transactionsCreditedUser = await listTransactionsUseCase.execute(creditedUserAccountId.accountId)
    const transactionsDebitedUser = await listTransactionsUseCase.execute(debitedUserAccount.accountId)
    expect(transactionsCreditedUser).toHaveLength(2)
    expect(transactionsDebitedUser).toHaveLength(3)
  })
})
