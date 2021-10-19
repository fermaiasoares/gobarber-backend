"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProvidersService = _interopRequireDefault(require("@modules/appointments/services/ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AppError from '@shared/errors/AppError';
let fakeUserRepository;
let fakeCacheProvider;
let listProviders;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviders = new _ListProvidersService.default(fakeUserRepository, fakeCacheProvider);
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const user2 = await fakeUserRepository.create({
      name: 'John Did',
      email: 'johndid@fake.com',
      password: '123456'
    });
    const loggedUser = await fakeUserRepository.create({
      name: 'John Does',
      email: 'johndoes@fake.com',
      password: '123456'
    });
    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });
    expect(providers).toEqual([user1, user2]);
  });
});