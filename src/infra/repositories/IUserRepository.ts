import { Account } from '../../domain/models/Account'
import { User } from '../../domain/models/User'

export interface CurrentBalance {
  username: string
  balance: number
}

export interface IUserRepository {
  create: (userData: User, accountData: Account) => Promise<void>
  listByUsername: (username: string) => Promise<User | null>
  getBalanceByUsername: (username: string) => Promise<CurrentBalance | null>
}
