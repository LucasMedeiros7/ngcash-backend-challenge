import { v4 as uuidv4 } from 'uuid'

export class Account {
  id: string
  balance: number

  constructor () {
    this.id = uuidv4()
    this.balance = 100
  }
}
