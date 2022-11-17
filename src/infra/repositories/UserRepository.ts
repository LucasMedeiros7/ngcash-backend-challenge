import { Account } from '../../domain/models/Account'
import { User } from '../../domain/models/User'
import { CurrentBalance, IUserRepository } from './IUserRepository'
import { prisma } from '../db/database'

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

  async getBalanceByUserId (userId: string): Promise<CurrentBalance | null> {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { account: true }
    })
    if (user == null) return null
    return {
      username: user.username,
      balance: user.account.balance
    }
  }
}

export { UserRepository }
