"use strict";

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("@modules/users/repositories/fakes/FakeUserTokensRepository"));

var _SendForgotPasswordEmailService = _interopRequireDefault(require("@modules/users/services/SendForgotPasswordEmailService"));

var _FakeMailProvider = _interopRequireDefault(require("@shared/container/providers/MailProvider/fakes/FakeMailProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeMailProvider;
let fakeUserTokenRepository;
let sendForgotPasswordEmail;
describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUsersRepository.default();
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUserTokenRepository = new _FakeUserTokensRepository.default();
    sendForgotPasswordEmail = new _SendForgotPasswordEmailService.default(fakeUserRepository, fakeMailProvider, fakeUserTokenRepository);
  });
  it('should be able to recover the password using your email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@fake.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });
  it('should be not able to recover a non-existing user password', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'fake@aol.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: '123456'
    });
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@fake.com'
    });
    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});