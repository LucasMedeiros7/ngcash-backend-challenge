import {
  CurrentBalance,
  IUserRepository
} from '../../infra/repositories/IUserRepository'

class GetBalance {
  constructor (private readonly userRepository: IUserRepository) { }

  async execute (username: string): Promise<CurrentBalance> {
    const currentBalance = await this.userRepository.getBalanceByUsername(username)
    if (currentBalance == null) {
      throw new Error('Usuário não existe')
    }
    return currentBalance
  }
}

export { GetBalance }
