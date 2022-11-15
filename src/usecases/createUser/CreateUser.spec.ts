import { validate } from 'uuid';
import bcrypt from 'bcrypt';

import { User } from '../../entities/User';
import { CreateUser } from './CreateUser';
import { IUserRepository } from '../../repositories/IUserRepository';

describe('CreateUserService', () => {
  let fakeRepository: IUserRepository;
  let service: CreateUser;

  beforeAll(() => {
    fakeRepository = {
      create(user: User): Promise<void> {
        return;
      },
    };
    service = new CreateUser(fakeRepository);
  });

  it('Deve criar um usuário e a senha deve ser criptogrfada', async () => {
    const user = await service.execute({
      username: 'fakename',
      password: 'V4lidpassword',
    });

    expect(validate(user.id)).toBe(true);
    expect(user.username).toBe('fakename');
    expect(bcrypt.compareSync('V4lidpassword', user.password)).toBe(true);
    expect(user.accountId).toBeTruthy();
  });

  it('Deve retornar um erro quando receber uma senha inválida', async () => {
    await expect(async () => {
      await service.execute({
        username: 'fakename',
        password: 'invalidpassword',
      });
    }).rejects.toThrow(Error);
  });
});
