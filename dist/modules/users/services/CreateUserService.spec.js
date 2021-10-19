"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("@modules/users/providers/HashProvider/fakes/FakeHashProvider"));

var _FakeCacheProvider = _interopRequireDefault(require("@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateUserService = _interopRequireDefault(require("@modules/users/services/CreateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let fakeCacheProvider;
let createUser;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUser = new _CreateUserService.default(fakeUserRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456'
    });
    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456'
    });
    await expect(createUser.execute({
      name: 'Fernando Maia',
      email: 'fermaiasoares@aol.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});