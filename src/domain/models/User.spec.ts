import { validate } from 'uuid'
import { Account } from './Account'
import { User } from './User'
import bcrypt from 'bcrypt'

describe('Create user model', () => {
  it('Should be able create an user', () => {
    const account = new Account()
    const user = new User({
      username: 'Fakename',
      password: 'valid4Password',
      accountId: account.id
    })

    expect(validate(user.id)).toBe(true)
    expect(user.username).toBe('Fakename')
    expect(bcrypt.compareSync('valid4Password', user.password)).toBe(true)
  })
})
