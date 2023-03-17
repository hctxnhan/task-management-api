import { User } from '@/entities/user.entity';
import { AuthService } from '@/features/auth/auth.service';
import { hashedPassword } from '@/utils/bcrypt-hash.util';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { password } = event.entity;
    event.entity.password = await hashedPassword(password);
  }
}
