import { validate } from 'uuid'
import { convertToBRLFormat } from '../../../utils/convertToBRLFormat'
import { Account } from './Account'

describe('Create account model', () => {
  it('Should be able create an account', () => {
    const account = new Account()

    expect(validate(account.id)).toBe(true)
    expect(convertToBRLFormat(account.balance)).toBe('R$100,00')
  })
})
