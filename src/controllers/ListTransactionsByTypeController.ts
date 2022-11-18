import { Request, Response } from 'express'
import { ListTransactionsByType } from '../domain/usecases/ListTransactionsByType'

export class ListTransactionsByTypeController {
  constructor (private readonly listTransactionByTypeUseCase: ListTransactionsByType) { }

  async handle (request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user
    const { transactionType } = request
    try {
      const transactions = await this.listTransactionByTypeUseCase.execute({
        accountId,
        type: transactionType
      })
      return response.json(transactions)
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
  }
}
