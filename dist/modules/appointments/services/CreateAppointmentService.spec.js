"use strict";

var _FakeAppointmentsRepository = _interopRequireDefault(require("@modules/appointments/repositories/fakes/FakeAppointmentsRepository"));

var _FakeNotificationsRepository = _interopRequireDefault(require("@modules/notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateAppointmentService = _interopRequireDefault(require("@modules/appointments/services/CreateAppointmentService"));

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakkeNotificationsRepository;
let fakeAppointmentsRepository;
let fakeCacheProvider;
let createAppointemnt;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakkeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointemnt = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakkeNotificationsRepository, fakeCacheProvider);
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointemnt.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123456',
      user_id: '654321'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 9, 15, 11);
    await createAppointemnt.execute({
      date: appointmentDate,
      provider_id: '123456',
      user_id: '654321'
    });
    await expect(createAppointemnt.execute({
      date: appointmentDate,
      provider_id: '123456',
      user_id: '654321'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past daste', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointemnt.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456',
      user_id: '654321'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointemnt.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'user',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointemnt.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: '654321',
      user_id: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointemnt.execute({
      date: new Date(2020, 4, 11, 18),
      provider_id: '654321',
      user_id: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});