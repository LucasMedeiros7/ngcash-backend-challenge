import { Transaction } from '@prisma/client'
import { ITransactionRepository } from '../../infra/repositories/ITransactionRepository'

interface input {
  accountId: string
  type: 'cash-in' | 'cash-out'
}

class ListTransactionsByType {
  constructor (private readonly transactionsRepository: ITransactionRepository) { }

  async execute ({ accountId, type }: input): Promise<Transaction[]> {
    const allTransactions = await this.transactionsRepository.list(accountId)

    if (type === 'cash-in') {
      const cashInTransactions = allTransactions.filter(
        (transaction) => transaction.creditedAccountId === accountId
      )
      return cashInTransactions
    }

    const cashOutTransactions = allTransactions.filter(
      (transaction) => transaction.debitedAccountId === accountId
    )
    return cashOutTransactions
  }
}

export { ListTransactionsByType }
