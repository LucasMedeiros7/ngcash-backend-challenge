declare namespace Express {
  export interface Request {
    user: {
      id: string
      accountId: string
    },
    transactionType: 'cash-in' | 'cash-out'
  }
}
