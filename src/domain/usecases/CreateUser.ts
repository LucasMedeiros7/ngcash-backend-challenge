import { Account } from '../models/Account'
import { User } from '../models/User'
import { IUserRepository } from '../../infra/repositories/IUserRepository'
import { validatePassword } from '../../utils/validatePassword'

interface CreateUserDTO {
  username: string
  password: string
}

class CreateUser {
  constructor (private readonly userRepository: IUserRepository) { }

  async execute ({ username, password }: CreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.userRepository.listByUsername(username)

    if (!validatePassword(password)) {
      throw new Error(
        'Senha deve conter pelo menos 8 caracteres, um número e uma letra maiúscula.'
      )
    }

    if (userAlreadyExists != null) {
      throw new Error('Usuário já cadastrado com esse username')
    }

    const account = new Account()
    const user = new User({ username, password, accountId: account.id })

    await this.userRepository.create(user, account)
    return user
  }
}

export { CreateUser }
