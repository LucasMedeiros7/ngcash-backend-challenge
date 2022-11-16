import { Account } from '../../../domain/models/account/Account'
import { User } from '../../../domain/models/user/User'
import { IUserRepository } from '../IUserRepository'
import { prisma } from '../../db/database'

class UserRepository implements IUserRepository {
  async create (userData: User, accountData: Account): Promise<void> {
    const { id, username, password } = userData
    await prisma.user.create({
      data: {
        id,
        username,
        password,
        account: {
          create: { ...accountData }
        }
      }
    })
  }

  async listByUsername (username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { username } })
    return user
  }
}

export { UserRepository }
