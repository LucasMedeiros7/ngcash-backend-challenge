import { Account, User } from '@prisma/client'
import { CurrentBalance, IUserRepository } from '../IUserRepository'

class FakeUserRepository implements IUserRepository {
  users: User[]
  accounts: Account[]

  constructor () {
    this.users = []
    this.accounts = []
  }

  async create (userData: User, accountData: Account): Promise<void> {
    this.users.push(userData)
    this.accounts.push(accountData)
  }

  async listByUsername (username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username)
    if (user == null) return null
    return user
  }

  async getBalanceByUsername (username: string): Promise<CurrentBalance | null> {
    const user = this.users.find(user => user.username === username)
    const account = this.accounts.find(account => account.id === user?.accountId)
    if ((user == null) || (account == null)) return null
    return {
      username: user.username,
      balance: account.balance
    }
  }
}

export { FakeUserRepository }
