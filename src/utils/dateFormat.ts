export function formatDate (date: string): Date {
  const [day, month, year] = date.split('/')
  const newDate = new Date(`${month}-${day}-${year}`)
  return newDate
}
