import { validatePassword } from '../../src/utils/validatePassword'

describe('Validate password', () => {
  it('Deve retornar true quando receber uma senha válida', () => {
    expect(validatePassword('V4lidPassword')).toBe(true)
  })

  it('Deve retornar false quando receber uma senha com menos de 8 caracteres', () => {
    expect(validatePassword('123456')).toBe(false)
  })

  it('Deve retornar false caso a senha não tenha pelo menos uma letra maiúscula', () => {
    expect(validatePassword('invalidpassword123')).toBe(false)
  })

  it('Deve retornar false caso a senha não possua pelo menos um número', () => {
    expect(validatePassword('invalidpassword')).toBe(false)
  })
})
