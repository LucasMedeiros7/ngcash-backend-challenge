import { Account } from '../../entities/Account';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { validatePassword } from '../../utils/validatePassword';

interface CreateUserDTO {
  username: string;
  password: string;
}

class CreateUser {
  constructor(private userRepository: IUserRepository) { }

  async execute({ username, password }: CreateUserDTO): Promise<User> {
    if (!validatePassword(password)) {
      throw new Error(
        'Senha inválida \n Deve conter pelo menos 8 caracteres, um número e uma letra maiúscula.'
      );
    }
    const { id: accountId } = new Account();
    const user = new User({ username, password, accountId });

    await this.userRepository.create(user);
    return user;
  }
}

export { CreateUser };
