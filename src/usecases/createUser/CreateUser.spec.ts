import { validate } from 'uuid'
import bcrypt from 'bcrypt'
import { User } from '../../models/user/User'
import { CreateUser } from './CreateUser'
import { IUserRepository } from '../../repositories/IUserRepository'

class FakeRepository implements IUserRepository {
  users: User[]

  constructor() {
    this.users = []
  }

  async create(userData: User): Promise<void> {
    this.users.push(userData)
  }

  async listByUsername(username: string): Promise<User | undefined> {
    const user = this.users.find(user => user.username === username)
    return user
  }
}

describe('CreateUserService', () => {
  it('Deve criar um usuário e a senha deve ser criptogrfada', async () => {
    const fakeRepository = new FakeRepository()

    const service = new CreateUser(fakeRepository)
    const user = await service.execute({
      username: 'fakename',
      password: 'V4lidpassword'
    })

    expect(validate(user.id)).toBe(true)
    expect(user.username).toBe('fakename')
    expect(bcrypt.compareSync('V4lidpassword', user.password)).toBe(true)
    expect(user.accountId).toBeTruthy()
  })

  it('Deve retornar um erro quando receber uma senha inválida', async () => {
    const fakeRepository = new FakeRepository()

    const service = new CreateUser(fakeRepository)
    await expect(async () => {
      await service.execute({
        username: 'fakename',
        password: 'invalidpassword'
      })
    }).rejects.toThrow(Error)
  })

  it('Deve retornar um erro quando o username já estiver cadastrado', async () => {
    const fakeRepository = new FakeRepository()
    const service = new CreateUser(fakeRepository)

    await expect(async () => {
      await service.execute({
        username: 'fakename',
        password: 'V4lidpassword'
      })
      await service.execute({
        username: 'fakename',
        password: 'V4lidpassword'
      })
    }).rejects.toThrow(Error)
  })
})
