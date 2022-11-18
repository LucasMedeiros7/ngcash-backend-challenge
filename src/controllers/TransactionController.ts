import { Request, Response } from 'express'
import { PerformTransaction } from '../domain/usecases/PerformTransaction'
import { convertToBRLFormat } from '../utils/convertToBRLFormat'

export class TransactionController {
  constructor (private readonly performTransactionUseCase: PerformTransaction) { }

  async handle (request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user
    const { accountDestinationId, value } = request.body

    try {
      const transaction = await this.performTransactionUseCase.execute({
        debitedAccountId: accountId,
        creditedAccountId: accountDestinationId,
        value
      })
      return response.status(201).json({
        ...transaction,
        value: convertToBRLFormat(transaction.value)
      })
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
  }
}
