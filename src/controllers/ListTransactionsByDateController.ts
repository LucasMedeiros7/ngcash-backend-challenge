import { Request, Response } from 'express'
import { ListTransactionsByDate } from '../domain/usecases/ListTransactionsByDate'
import { convertToBRLFormat } from '../utils/convertToBRLFormat'

export class ListTransactionsByDateController {
  constructor(private readonly listTransactionByDateUseCase: ListTransactionsByDate) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user
    const date = request.query.date
    try {
      if (date != 'string') {
        return response.status(400).json({ error: 'Formato de data inválido' })
      }
      const transactions = await this.listTransactionByDateUseCase.execute({
        accountId,
        date: date
      })
      const transactionWithFormattedValue = transactions.map(transaction => {
        return {
          ...transaction,
          value: convertToBRLFormat(transaction.value)
        }
      })
      return response.json(transactionWithFormattedValue)
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
  }
}
