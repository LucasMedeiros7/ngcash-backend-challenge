import request from 'supertest'
import { app } from '../server'
import { prisma } from '../infra/db/database'

beforeAll(async () => {
  await prisma.user.deleteMany()
  await prisma.account.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.account.deleteMany()
})

describe('[POST] /users', () => {
  it('Deve ser possível criar um usuário', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'fakename',
        password: 'V4lidPassword'
      })
      .expect(201)

    expect(response.body.username).toBe('fakename')
    expect(response.body.password).toBeFalsy()
  })

  it('Deve retornar 409 quando o username já existir', async () => {
    await request(app)
      .post('/users')
      .send({
        username: 'fakename2',
        password: 'V4lidPassword'
      })
      .expect(201)

    const response = await request(app)
      .post('/users')
      .send({
        username: 'fakename2',
        password: 'V4lidPassword'
      })
      .expect(409)

    expect(response.body.error).toBeTruthy()
  })
})

it('Deve retornar 422 se os dados estiverem incorretos', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      username: 'fakename3',
      password: 'invalidPassword'
    })
    .expect(422)

  expect(response.body.error).toBeTruthy()
})
