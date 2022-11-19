import { Transaction } from '../../src/domain/models/Transaction'
import { ITransactionRepository } from '../../src/infra/repositories/ITransactionRepository'

export class FakeTransactionRepository implements ITransactionRepository {
  transactions: Transaction[]

  constructor () {
    this.transactions = []
  }

  async save (transaction: Transaction): Promise<void> {
    this.transactions.push(transaction)
  }

  async listByAccountId (accountId: string): Promise<Transaction[]> {
    const transactions = this.transactions.filter(({ creditedAccountId, debitedAccountId }) => {
      return creditedAccountId === accountId || debitedAccountId === accountId
    })
    return transactions
  }
}
