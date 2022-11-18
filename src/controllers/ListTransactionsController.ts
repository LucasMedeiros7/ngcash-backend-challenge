import { Request, Response } from 'express'
import { ListTransactions } from '../domain/usecases/ListTransactions'

export class ListTransactionsController {
  constructor(private readonly listTransactionUseCase: ListTransactions) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user
    try {
      const transactions = await this.listTransactionUseCase.execute(accountId)
      return response.json(transactions)
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
  }
}
