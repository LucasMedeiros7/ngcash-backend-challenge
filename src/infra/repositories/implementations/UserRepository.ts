import { Account } from '../../../domain/models/Account'
import { User } from '../../../domain/models/User'
import { CurrentBalance, IUserRepository, PerformTransactionInput } from '../IUserRepository'
import { prisma } from '../../db/database'

class UserRepository implements IUserRepository {
  async listByAccountId (accountId: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { accountId } })
    return user
  }

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
    }).catch(console.error)
  }

  async listByUsername (username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { username } })
    return user
  }

  async performTransaction ({ debited, credited }: PerformTransactionInput): Promise<void> {
    Promise.all([
      await prisma.account.update({
        where: { id: debited.accountId },
        data: { balance: debited.value }
      }),
      await prisma.account.update({
        where: { id: credited.accountId },
        data: { balance: credited.value }
      })
    ]).catch(console.error)
  }

  async getBalanceByUserId (userId: string): Promise<CurrentBalance> {
    const user = await prisma.user.findFirst({ where: { id: userId } }) as User
    const { balance } = await prisma.account.findFirst({ where: { id: user.accountId } }) as Account
    return {
      username: user.username,
      balance
    }
  }
}

export { UserRepository }