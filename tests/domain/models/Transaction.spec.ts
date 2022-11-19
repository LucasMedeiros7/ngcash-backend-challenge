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
    }).toThrowError('Impossível realizar está transferência')
  })

  it('Should return an error when creditedAccountId is equal debitedAccountId', () => {
    const transaction = new Transaction()

    expect(() => {
      transaction.create({
        creditedAccountId: 'any_idDebited',
        debitedAccountId: 'any_idDebited',
        value: 10
      })
    }).toThrowError('Impossível realizar está transferência')
  })
})
