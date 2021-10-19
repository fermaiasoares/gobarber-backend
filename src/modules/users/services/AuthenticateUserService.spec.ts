import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await fakeUserRepository.create({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'fermaiasoares@aol.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'fermaiasoares@aol.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate wrong password', async () => {
    await fakeUserRepository.create({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'fermaiasoares@aol.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
