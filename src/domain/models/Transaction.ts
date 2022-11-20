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

  constructor () {
    this.id = uuidv4()
    this.createdAt = new Date()
  }

  create ({ debitedAccountId, creditedAccountId, value }: input): void {
    if (debitedAccountId === creditedAccountId) throw new Error('Conta que recebe o cash-in não pode ser igual a conta que faz o cash-out')
    if (value <= 0) throw new Error('Valor da transferência deve ser maior que 0')

    this.debitedAccountId = debitedAccountId
    this.creditedAccountId = creditedAccountId
    this.value = value
  }
}
