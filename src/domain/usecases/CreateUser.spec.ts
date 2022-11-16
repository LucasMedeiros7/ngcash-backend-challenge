import { validate } from 'uuid'
import bcrypt from 'bcrypt'
import { CreateUser } from './CreateUser'
import { FakeUserRepository } from '../../infra/repositories/in-memory/FakeUserRepository'

describe('Create user usecase', () => {
  it('Deve criar um usuário e a senha deve ser criptogrfada', async () => {
    const fakeRepository = new FakeUserRepository()

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
    const fakeRepository = new FakeUserRepository()

    const service = new CreateUser(fakeRepository)
    await expect(async () => {
      await service.execute({
        username: 'fakename',
        password: 'invalidpassword'
      })
    }).rejects.toThrow(Error)
  })

  it('Deve retornar um erro quando o username já estiver cadastrado', async () => {
    const fakeRepository = new FakeUserRepository()
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
