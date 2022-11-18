import { Transaction } from '@prisma/client'
import { ITransactionRepository } from '../../infra/repositories/ITransactionRepository'

class ListTransactions {
  constructor (private readonly transactionRepository: ITransactionRepository) { }

  async execute (accountId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.list(accountId)
    return transactions
  }
}

export { ListTransactions }
