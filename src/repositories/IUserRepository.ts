import { User } from '../entities/User'

export interface IUserRepository {
  create: (userData: User) => Promise<void>
  listByUsername: (username: string) => Promise<User | undefined>
}
