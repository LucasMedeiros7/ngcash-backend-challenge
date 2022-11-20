import { validate } from 'uuid'
import { Transaction } from '../../../src/domain/models/Transaction'

describe('Create transaction model', () => {
  it('Should be able create an transaction', () => {
    const transaction = new Transaction()

    transaction.create({
      creditedAccountId: 'any_idDebited',
      debitedAccountId: 'any_idCredited',
      value: 10
    })

    expect(validate(transaction.id)).toBe(true)
    expect(transaction.createdAt).toBeInstanceOf(Date)
  })

  it('Should return an error when value <= 0', () => {
    const transaction = new Transaction()

    expect(() => {
      transaction.create({
        creditedAccountId: 'any_idDebited',
        debitedAccountId: 'any_idCredited',
        value: 0
      })
    }).toThrowError('Valor da transferência deve ser maior que 0')
  })

  it('Should return an error when creditedAccountId is equal debitedAccountId', () => {
    const transaction = new Transaction()

    expect(() => {
      transaction.create({
        creditedAccountId: 'any_idDebited',
        debitedAccountId: 'any_idDebited',
        value: 10
      })
    }).toThrowError('Conta que recebe o cash-in não pode ser igual a conta que faz o cash-out')
  })
})
