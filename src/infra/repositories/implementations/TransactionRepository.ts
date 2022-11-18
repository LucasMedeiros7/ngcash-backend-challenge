import { prisma } from '../../db/database'
import { Transaction } from '../../../domain/models/Transaction'
import { ITransactionRepository } from '../ITransactionRepository'

class TransactionRepository implements ITransactionRepository {
  async save (transaction: Transaction): Promise<void> {
    await prisma.transaction.create({ data: { ...transaction } })
  };

  async list (accountId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        creditedAccountId: accountId,
        debitedAccountId: accountId
      }
    }) as Transaction[]

    return transactions
  }
}
export { TransactionRepository }
