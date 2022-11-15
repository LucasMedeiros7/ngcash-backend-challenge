export function convertToBRLFormat (amount: number): string {
  const integertoDecimal = amount / 100
  const formatted = integertoDecimal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return 'R$' + formatted.replace('R$', '').trim()
}
