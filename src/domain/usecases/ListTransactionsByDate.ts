import { Transaction } from '@prisma/client'
import { ITransactionRepository } from '../../infra/repositories/ITransactionRepository'
import { formatDate } from '../../utils/dateFormat'

interface input {
  accountId: string
  date: string
}

class ListTransactionByDate {
  constructor (private readonly transactionRepository: ITransactionRepository) { }

  async execute ({ accountId, date }: input): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.listByAccountId(accountId)
    const dateFormatted = formatDate(date)
    const transactionsByDate = transactions.filter(
      transaction => transaction.createdAt.toDateString() === dateFormatted.toDateString()
    )
    return transactionsByDate
  }
}

export { ListTransactionByDate }
