import { convertToBRLFormat } from './convertToBRLFormat'

describe('Convert to BRL format currency', () => {
  it('Deve formatar o valor inteiro para BRL', () => {
    expect(convertToBRLFormat(500)).toBe('R$5,00')
  })
  it('Deve formatar o valor inteiro para BRL', () => {
    expect(convertToBRLFormat(10000)).toBe('R$100,00')
  })
})
