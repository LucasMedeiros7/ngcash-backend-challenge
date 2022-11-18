import { Account } from '../../domain/models/Account'
import { User } from '../../domain/models/User'

export interface CurrentBalance {
  id: string
  username: string
  balance: number
  accountId: string
}

export interface PerformTransactionInput {
  debited: {
    accountId: string
    value: number
  }
  credited: {
    accountId: string
    value: number
  }
}

export interface IUserRepository {
  create: (userData: User, accountData: Account) => Promise<void>
  listByUsername: (username: string) => Promise<User | null>
  getBalanceByUserId: (userId: string) => Promise<CurrentBalance>
  listByAccountId: (accountId: string) => Promise<User | null>
  performTransaction: ({ debited, credited }: PerformTransactionInput) => Promise<void>
}
