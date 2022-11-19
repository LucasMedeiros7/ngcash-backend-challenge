import { validate } from 'uuid'
import { convertToBRLFormat } from '../../../src/utils/convertToBRLFormat'
import { Account } from '../../../src/domain/models/Account'

describe('Create account model', () => {
  it('Should be able create an account', () => {
    const account = new Account()

    expect(validate(account.id)).toBe(true)
    expect(convertToBRLFormat(account.balance)).toBe('R$100,00')
  })
})
