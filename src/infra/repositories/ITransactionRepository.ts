import { Transaction } from '../../domain/models/Transaction'

export interface ITransactionRepository {
  save: (transaction: Transaction) => Promise<void>
  list: (accountId: string) => Promise<Transaction[]>
}
