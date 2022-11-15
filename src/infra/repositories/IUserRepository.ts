import { Account } from '../../models/account/Account'
import { User } from '../../models/user/User'

export interface IUserRepository {
  create: (userData: User, accountData: Account) => Promise<void>
  listByUsername: (username: string) => Promise<User | null>
}
