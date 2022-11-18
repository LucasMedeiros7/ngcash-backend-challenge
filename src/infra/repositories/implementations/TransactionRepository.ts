import { prisma } from '../../db/database'
import { Transaction } from '../../../domain/models/Transaction'
import { ITransactionRepository } from '../ITransactionRepository'

class TransactionRepository implements ITransactionRepository {
  async save (transaction: Transaction): Promise<void> {
    await prisma.transaction.create({ data: { ...transaction } })
  };
}

export { TransactionRepository }
