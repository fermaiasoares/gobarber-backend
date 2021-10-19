import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notificaton = new Notification();

    Object.assign(notificaton, {
      id: new ObjectID(),
      content,
      recipient_id,
    });

    this.notifications.push(notificaton);

    return notificaton;
  }
}

export default FakeNotificationsRepository;
