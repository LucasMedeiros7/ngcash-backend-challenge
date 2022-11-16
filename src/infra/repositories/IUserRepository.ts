import { Account } from '../../domain/models/account/Account'
import { User } from '../../domain/models/user/User'

export interface IUserRepository {
  create: (userData: User, accountData: Account) => Promise<void>
  listByUsername: (username: string) => Promise<User | null>
}
