import {
  CurrentBalance,
  IUserRepository
} from '../../infra/repositories/IUserRepository'

class GetBalance {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(userId: string): Promise<CurrentBalance> {
    const currentBalance = await this.userRepository.getBalanceByUserId(userId)
    if (currentBalance == null) {
      throw new Error('Usuário não existe')
    }
    return currentBalance
  }
}

export { GetBalance }
