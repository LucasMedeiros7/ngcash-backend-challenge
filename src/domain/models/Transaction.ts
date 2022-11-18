import { v4 as uuidv4 } from 'uuid'

interface input {
  debitedAccountId: string
  creditedAccountId: string
  value: number
}

export class Transaction {
  id: string
  debitedAccountId: string
  creditedAccountId: string
  value: number
  createdAt: Date

  constructor ({ debitedAccountId, creditedAccountId, value }: input) {
    if (debitedAccountId === creditedAccountId || value <= 0) {
      throw new Error('Impossível realizar está transferência')
    }
    this.id = uuidv4()
    this.debitedAccountId = debitedAccountId
    this.creditedAccountId = creditedAccountId
    this.value = value
    this.createdAt = new Date()
  }
}
