import { Transaction } from '@prisma/client'
import { ITransactionRepository } from '../../infra/repositories/ITransactionRepository'
import { formatDate } from '../../utils/dateFormat'

interface input {
  accountId: string
  date: string
}

class ListTransactionsByDate {
  constructor (private readonly transactionRepository: ITransactionRepository) { }

  async execute ({ accountId, date }: input): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.listByAccountId(accountId)

    const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/
    if (!regexDate.test(date)) {
      throw new Error('Formato de data inválido. \n Use o formato dd/mm/yyyy')
    }

    const dateFormatted = formatDate(date)
    const transactionsByDate = transactions.filter(
      transaction => transaction.createdAt.toDateString() === dateFormatted.toDateString()
    )
    return transactionsByDate
  }
}

export { ListTransactionsByDate }
