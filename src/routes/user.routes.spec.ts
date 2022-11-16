import request from 'supertest'
import { app } from '../'
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
        username: 'fakename1',
        password: 'V4lidPassword'
      })
      .expect(201)

    expect(response.body.username).toBe('fakename1')
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
})

describe('[GET] /users/balance', () => {
  it('Deve exibir o saldo atual do usuário', async () => {
    await request(app).post('/users').send({
      username: 'fakename150',
      password: 'V4lidPassword'
    })

    const loginResponse = await request(app).post('/login').send({
      username: 'fakename150',
      password: 'V4lidPassword'
    })

    const getBalanceResponse = await request(app)
      .get('/users/balance')
      .set({ Authorization: `Bearer ${loginResponse.body.accessToken as string}` })
      .expect(200)

    expect(getBalanceResponse.body).toMatchObject({
      username: 'fakename150',
      balance: 'R$100,00'
    })
  })

  it('Deve retornar um 403 se o usuário não estiver logado', async () => {
    await request(app).post('/users').send({
      username: 'fakename150',
      password: 'V4lidPassword'
    })

    const getBalanceResponse = await request(app)
      .get('/users/balance')
      .set({ Authorization: 'Bearer invalidtoken' })
      .expect(403)

    expect(getBalanceResponse.body.error).toBeTruthy()
  })
})
