"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("@modules/users/providers/HashProvider/fakes/FakeHashProvider"));

var _AuthenticateUserService = _interopRequireDefault(require("@modules/users/services/AuthenticateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let authenticateUser;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    authenticateUser = new _AuthenticateUserService.default(fakeUserRepository, fakeHashProvider);
  });
  it('should be able to authenticate', async () => {
    await fakeUserRepository.create({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456'
    });
    const response = await authenticateUser.execute({
      email: 'fermaiasoares@aol.com',
      password: '123456'
    });
    expect(response).toHaveProperty('token');
  });
  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'fermaiasoares@aol.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to authenticate wrong password', async () => {
    await fakeUserRepository.create({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456'
    });
    await expect(authenticateUser.execute({
      email: 'fermaiasoares@aol.com',
      password: '654321'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});