import { Transaction } from '../../domain/models/Transaction'

export interface ITransactionRepository {
  save: (transaction: Transaction) => Promise<void>
  listByAccountId: (accountId: string) => Promise<Transaction[]>
}
