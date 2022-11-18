import request from 'supertest'
import { app } from '../'
import { prisma } from '../infra/db/database'

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

    const userDebitedResponse = await request(app)
      .get('/users/balance')
      .set({
        Authorization: `Bearer ${loginResponse.body.accessToken as string}`
      })
      .expect(200)

    expect(userDebitedResponse.body.balance).toBe('R$90,00')
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
