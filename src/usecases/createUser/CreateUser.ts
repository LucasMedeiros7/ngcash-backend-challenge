import { Account } from '../../models/account/Account'
import { User } from '../../models/user/User'
import { IUserRepository } from '../../repositories/IUserRepository'
import { validatePassword } from '../../utils/validatePassword'

interface CreateUserDTO {
  username: string
  password: string
}

class CreateUser {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute({ username, password }: CreateUserDTO): Promise<User> {
    if (!validatePassword(password)) {
      throw new Error(
        'Senha inválida \n Deve conter pelo menos 8 caracteres, um número e uma letra maiúscula.'
      )
    }

    const userAlreadyExists = await this.userRepository.listByUsername(username)
    if (userAlreadyExists != null) {
      throw new Error('Usuário já cadastrado com esse "username"')
    }

    const { id: accountId } = new Account()
    const user = new User({ username, password, accountId })

    await this.userRepository.create(user)
    return user
  }
}

export { CreateUser }
