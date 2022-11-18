import { validate } from 'uuid';
import { Transaction } from './Transaction';

describe('Create transaction model', () => {
  it('Should be able create an transaction', () => {
    const transaction = new Transaction({
      creditedAccountId: 'any_idDebited',
      debitedAccountId: 'any_idCredited',
      value: 10,
    });

    expect(validate(transaction.id)).toBe(true);
    expect(transaction.createdAt).toBeInstanceOf(Date)
  });

  it('Should return an error when value <= 0', () => {
    expect(new Transaction({
      creditedAccountId: 'any_idDebited',
      debitedAccountId: 'any_idCredited',
      value: 0,
    })).toThrowError();
  });

  it('Should return an error when creditedAccountId is equal debitedAccountId', () => {
    expect(new Transaction({
      creditedAccountId: 'any_idDebited',
      debitedAccountId: 'any_idDebited',
      value: 10,
    })).toThrowError();
  });
});
