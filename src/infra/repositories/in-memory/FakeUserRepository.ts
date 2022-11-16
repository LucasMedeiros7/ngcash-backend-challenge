import { User } from '@prisma/client'
import { IUserRepository } from '../IUserRepository'

class FakeUserRepository implements IUserRepository {
  users: User[]

  constructor () {
    this.users = []
  }

  async create (userData: User): Promise<void> {
    this.users.push(userData)
  }

  async listByUsername (username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username)
    if (user == null) return null
    return user
  }
}

export { FakeUserRepository }
