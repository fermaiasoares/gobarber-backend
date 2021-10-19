"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _ShowProfileService = _interopRequireDefault(require("@modules/users/services/ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let showProfile;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    showProfile = new _ShowProfileService.default(fakeUserRepository);
  });
  it('should be able show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const showUserProfile = await showProfile.execute({
      user_id: user.id
    });
    expect(showUserProfile.name).toBe('John Doe');
  });
  it('should not be able show the profile from non-existing user', async () => {
    await expect(showProfile.execute({
      user_id: 'non-existing-user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});