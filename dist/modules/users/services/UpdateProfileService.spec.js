"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("@modules/users/providers/HashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("@modules/users/services/UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUserRepository, fakeHashProvider);
  });
  it('should be able update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Did',
      email: 'johndid@fake.com'
    });
    expect(updatedUser.name).toBe('John Did');
    expect(updatedUser.email).toBe('johndid@fake.com');
  });
  it('should not be able update email another user', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const user = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@fake.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Did',
      email: 'johndoe@fake.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndid@fake.com',
      old_password: '123456',
      password: '123456789'
    });
    expect(updatedUser.password).toBe('123456789');
  });
  it('should not be able update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndid@fake.com',
      password: '123456789'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndid@fake.com',
      old_password: 'wrong-old-password',
      password: '123456789'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able update the profile from non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-user-id',
      name: 'John Doe',
      email: 'johndid@fake.com',
      old_password: 'wrong-old-password',
      password: '123456789'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});