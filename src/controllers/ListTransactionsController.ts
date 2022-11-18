import { Request, Response } from 'express'
import { ListTransactions } from '../domain/usecases/ListTransactions'
import { convertToBRLFormat } from '../utils/convertToBRLFormat'

export class ListTransactionsController {
  constructor (private readonly listTransactionUseCase: ListTransactions) { }

  async handle (request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user
    try {
      const transactions = await this.listTransactionUseCase.execute(accountId)
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
