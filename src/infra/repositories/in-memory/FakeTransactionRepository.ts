import { Transaction } from '../../../domain/models/Transaction'
import { ITransactionRepository } from '../ITransactionRepository'

export class FakeTransactionRepository implements ITransactionRepository {
  transactions: Transaction[]

  constructor () {
    this.transactions = []
  }

  async save (transaction: Transaction): Promise<void> {
    this.transactions.push(transaction)
  }

  async list (accountId: string): Promise<Transaction[]> {
    const transactions = this.transactions.filter(({ creditedAccountId, debitedAccountId }) => {
      return creditedAccountId === accountId || debitedAccountId === accountId
    })
    return transactions
  }
}
