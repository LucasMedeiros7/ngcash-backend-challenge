import { Request, Response } from 'express'
import { GetBalance } from '../domain/usecases/GetBalance'
import { convertToBRLFormat } from '../utils/convertToBRLFormat'

export class GetBalanceController {
  constructor(private readonly getBalanceUseCase: GetBalance) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { username } = request
    try {
      const currentBalance = await this.getBalanceUseCase.execute(username)
      return response.json({
        ...currentBalance,
        balance: convertToBRLFormat(currentBalance.balance)
      })
    } catch (err) {
      return response.status(404).json({ error: err.message })
    }
  }
}
