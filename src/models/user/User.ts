import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

interface input {
  username: string
  password: string
  accountId: string
}

export class User {
  id: string
  username: string
  password: string
  accountId: string

  constructor({ username, password, accountId }: input) {
    this.id = uuidv4()
    this.username = username
    this.password = bcrypt.hashSync(password, 10)
    this.accountId = accountId
  }
}
