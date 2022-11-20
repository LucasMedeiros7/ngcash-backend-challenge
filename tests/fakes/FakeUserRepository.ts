import { Account } from '../../src/domain/models/Account'
import { User } from '../../src/domain/models/User'
import { IUserRepository, PerformTransactionInput, CurrentBalance } from '../../src/infra/repositories/IUserRepository'

class FakeUserRepository implements IUserRepository {
  users: User[]
  accounts: Account[]

  constructor () {
    this.users = []
    this.accounts = []
  }

  async listByAccountId (accountId: string): Promise<User | null> {
    const user = this.users.find((user) => user.accountId === accountId)
    if (user == null) return null
    return user
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

  async performTransaction ({ debited, credited }: PerformTransactionInput): Promise<void> {
    const debitedAccount = this.accounts.find(account => account.id === debited.accountId) as Account
    const creditedAccount = this.accounts.find(account => account.id === credited.accountId) as Account
    debitedAccount.balance = debited.value
    creditedAccount.balance = credited.value
  }

  async getBalanceByUserId (userId: string): Promise<CurrentBalance> {
    const user = this.users.find(user => user.id === userId) as User
    const account = this.accounts.find(account => account.id === user.accountId) as Account
    return {
      username: user.username,
      balance: account.balance
    }
  }
}

export { FakeUserRepository }
