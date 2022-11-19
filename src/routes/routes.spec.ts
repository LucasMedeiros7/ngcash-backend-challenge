import request from 'supertest'
import { app } from '..'
import { prisma } from '../infra/db/database'

beforeAll(async () => {
  await prisma.user.deleteMany()
  await prisma.account.deleteMany()
  await prisma.transaction.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.account.deleteMany()
  await prisma.transaction.deleteMany()
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

describe('[POST] /transactions', () => {
  let debitedUser: request.Response
  let creditedUser: request.Response

  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.account.deleteMany()
    await prisma.transaction.deleteMany()

    debitedUser = await request(app).post('/users').send({
      username: 'debitedUser',
      password: 'V4lidPassword'
    })

    creditedUser = await request(app).post('/users').send({
      username: 'creditedUser',
      password: 'V4lidPassword'
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.account.deleteMany()
    await prisma.transaction.deleteMany()
  })

  it('Deve realizar uma transferência e debitar o valor correto da conta de origem', async () => {
    const loginResponse = await request(app).post('/login').send({
      username: debitedUser.body.username,
      password: 'V4lidPassword'
    })

    const transaction1 = await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1000 // = R$10,00
      }).expect(201)

    const transaction2 = await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1500 // = R$10,00
      }).expect(201)

    const userDebitedResponse = await request(app)
      .get('/users/balance')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .expect(200)

    expect(transaction1.body.value).toBe('R$10,00')
    expect(transaction2.body.value).toBe('R$15,00')
    expect(userDebitedResponse.body.balance).toBe('R$75,00')
  })

  it('Deve realizar uma transferência e creditar o valor correto na conta de destino', async () => {
    const userDebitedLoginResponse = await request(app).post('/login').send({
      username: debitedUser.body.username,
      password: 'V4lidPassword'
    })

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${userDebitedLoginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1500 // = R$10,00
      })
      .expect(201)

    const userCreditedLoginResponse = await request(app).post('/login').send({
      username: creditedUser.body.username,
      password: 'V4lidPassword'
    })

    const userCreditedResponse = await request(app)
      .get('/users/balance')
      .set({
        Authorization: `Bearer ${userCreditedLoginResponse.body.accessToken as string}`
      })
      .expect(200)

    expect(userCreditedResponse.body.balance).toBe('R$115,00')
  })

  it('Deve retornar 400 caso o valor da transferência seja maior que o saldo atual', async () => {
    const userDebitedLoginResponse = await request(app).post('/login').send({
      username: debitedUser.body.username,
      password: 'V4lidPassword'
    })

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${userDebitedLoginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 15000 // = R$150,00
      })
      .expect(400)
  })

  it('Deve retornar 403 caso o usuário não esteja logado', async () => {
    await request(app)
      .post('/transactions')
      .set({
        Authorization: 'Bearer invalidtoken'
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 15000 // = R$150,00
      })
      .expect(403)
  })
})

describe('[GET] /transactions', () => {
  let debitedUser: request.Response
  let creditedUser: request.Response

  beforeEach(async () => {
    debitedUser = await request(app).post('/users').send({
      username: 'debitedUser',
      password: 'V4lidPassword'
    })

    creditedUser = await request(app).post('/users').send({
      username: 'creditedUser',
      password: 'V4lidPassword'
    })
  })

  it('Deve listar todas as transferências', async () => {
    const loginResponse = await request(app).post('/login').send({
      username: debitedUser.body.username,
      password: 'V4lidPassword'
    })

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1000 // = R$10,00
      })
      .expect(201)

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1500 // = R$15,00
      })
      .expect(201)

    const allTransactions = await request(app)
      .get('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .expect(200)

    expect(allTransactions.body).toHaveLength(2)
  })
})

describe('[GET] /transactions/?{date=day/month/year}', () => {
  let debitedUser: request.Response
  let creditedUser: request.Response

  beforeEach(async () => {
    debitedUser = await request(app).post('/users').send({
      username: String(Math.random() * 100), // fakename
      password: 'V4lidPassword'
    })

    creditedUser = await request(app).post('/users').send({
      username: String(Math.random() * 100), // fakename
      password: 'V4lidPassword'
    })
  })

  it('Deve listar todas as por data', async () => {
    const loginResponse = await request(app).post('/login').send({
      username: debitedUser.body.username,
      password: 'V4lidPassword'
    })

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1000 // = R$10,00
      })
      .expect(201)

    await request(app)
      .post('/transactions')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .send({
        accountDestinationId: creditedUser.body.accountId,
        value: 1500 // = R$15,00
      })
      .expect(201)

    const todayDate = new Date().toLocaleDateString()

    const allTransactions = await request(app)
      .get(`/transactions/?date=${todayDate}`)
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .expect(200)

    expect(allTransactions.body).toHaveLength(2)
  })
})
