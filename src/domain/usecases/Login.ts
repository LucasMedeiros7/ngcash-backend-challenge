import { IUserRepository } from '../../infra/repositories/IUserRepository'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

interface input {
  username: string
  password: string
}

export class Login {
  constructor (private readonly userRepository: IUserRepository) { }

  async execute ({ username, password }: input): Promise<{ accessToken: string }> {
    const user = await this.userRepository.listByUsername(username)

    if (user == null) {
      throw new Error('Não existe uma conta com esse username')
    }

    const isValidPassword = bcrypt.compareSync(password, user.password)

    if (!isValidPassword) {
      throw new Error('Senha inválida')
    }

    const secret = process.env.ACCESS_TOKEN_SECRET as string
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '24h' })

    return { accessToken: token }
  }
}
