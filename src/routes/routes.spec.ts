import request from 'supertest'
import { app } from '../'
import { prisma } from '../infra/db/database'

beforeAll(async () => {
  await Promise.all([
    await prisma.user.deleteMany(),
    await prisma.account.deleteMany()
  ]).catch(console.error)
})

afterAll(async () => {
  await Promise.all([
    await prisma.user.deleteMany(),
    await prisma.account.deleteMany()
  ]).catch(console.error)
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

describe('[POST] /login', () => {
  it('Deve retornar um token de acesso quando o usuário fizer o login', async () => {
    await request(app).post('/users').send({
      username: 'fakename4',
      password: 'V4lidPassword'
    })

    const response = await request(app)
      .post('/login')
      .send({
        username: 'fakename4',
        password: 'V4lidPassword'
      })
      .expect(200)

    expect(response.body.accessToken).toBeTruthy()
  })

  it('Deve retornar 404 quando o username não existir', async () => {
    await request(app).post('/users').send({
      username: 'fakename5',
      password: 'V4lidPassword'
    })

    const response = await request(app)
      .post('/login')
      .send({
        username: 'invalidfakename150',
        password: 'V4lidPassword'
      })
      .expect(404)

    expect(response.body.error).toBeTruthy()
  })

  it('Deve retornar 401 quando a senha passada for incorreta', async () => {
    await request(app).post('/users').send({
      username: 'fakename6',
      password: 'V4lidPassword'
    })

    const response = await request(app)
      .post('/login')
      .send({
        username: 'fakename6',
        password: 'invalidpassword'
      })
      .expect(401)

    expect(response.body.error).toBeTruthy()
  })
})
