import { prisma } from '../../db/database'
import { Transaction } from '../../../domain/models/Transaction'
import { ITransactionRepository } from '../ITransactionRepository'

class TransactionRepository implements ITransactionRepository {
  async save (transaction: Transaction): Promise<void> {
    await prisma.transaction.create({ data: { ...transaction } })
  };

  async listByAccountId (accountId: string): Promise<Transaction[]> {
    const transactionsCredited = await prisma.transaction.findMany({
      where: { creditedAccountId: accountId }
    }) as Transaction[]
    const transactionsDebited = await prisma.transaction.findMany({
      where: { debitedAccountId: accountId }
    }) as Transaction[]

    return [...transactionsCredited, ...transactionsDebited]
  }
}
export { TransactionRepository }
