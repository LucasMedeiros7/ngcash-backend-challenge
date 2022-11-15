import { User } from '../models/user/User'

export interface IUserRepository {
  create: (userData: User) => Promise<void>
  listByUsername: (username: string) => Promise<User | undefined>
}
