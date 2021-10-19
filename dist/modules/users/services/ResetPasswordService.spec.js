"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUserTokensRepository"));

var _FakeHashProvider = _interopRequireDefault(require("@modules/users/providers/HashProvider/fakes/FakeHashProvider"));

var _ResetPasswordService = _interopRequireDefault(require("@modules/users/services/ResetPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeUserTokenRepository;
let resetPassword;
let fakeHashProvider;
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeUserTokenRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPassword = new _ResetPasswordService.default(fakeUserRepository, fakeUserTokenRepository, fakeHashProvider);
  });
  it('should be able to recover the password using your email', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokenRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPassword.execute({
      password: '123456789',
      token
    });
    const updatedUser = await fakeUserRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('123456789');
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('123456789');
  });
  it('should not be able to reset password with no-existing token', async () => {
    await expect(resetPassword.execute({
      token: 'non-existing-token',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password with no-existing user', async () => {
    const {
      token
    } = await fakeUserTokenRepository.generate('non-existing-user');
    await expect(resetPassword.execute({
      token,
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokenRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(resetPassword.execute({
      password: '123456789',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});