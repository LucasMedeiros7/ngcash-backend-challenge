import { ITransactionRepository } from '../../infra/repositories/ITransactionRepository'
import { IUserRepository } from '../../infra/repositories/IUserRepository'
import { Transaction } from '../models/Transaction'

interface input {
  debitedAccountId: string
  creditedAccountId: string
  value: number
}

class PerformTransaction {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly transactionRepository: ITransactionRepository
  ) { }

  async execute ({ debitedAccountId, creditedAccountId, value }: input): Promise<Transaction> {
    const creditedUserAccount = await this.userRepository.listByAccountId(
      creditedAccountId
    )
    const debitedUserAccount = await this.userRepository.listByAccountId(
      debitedAccountId
    )

    if ((creditedUserAccount == null) || (debitedUserAccount == null)) {
      const originOrDestination = (creditedUserAccount == null) ? 'destino' : 'origem'
      throw new Error(`Conta de ${originOrDestination} não existe`)
    }
    const transaction = new Transaction()
    transaction.create({ creditedAccountId, debitedAccountId, value })

    const { balance: debitedAccountBalance } =
      await this.userRepository.getBalanceByUserId(debitedUserAccount.id)
    const { balance: creditedAccountBalance } =
      await this.userRepository.getBalanceByUserId(creditedUserAccount.id)

    if (debitedAccountBalance < value) {
      throw new Error('Saldo insuficiente')
    }

    await this.userRepository.performTransaction({
      debited: {
        accountId: debitedAccountId,
        value: debitedAccountBalance - value
      },
      credited: {
        accountId: creditedAccountId,
        value: creditedAccountBalance + value
      }
    })
    await this.transactionRepository.save(transaction)

    return transaction
  }
}

export { PerformTransaction }
