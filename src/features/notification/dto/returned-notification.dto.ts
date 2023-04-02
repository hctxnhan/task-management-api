import { NotificationType } from '@/types/enum';
import { Expose } from 'class-transformer';

export class ReturnedNotificationDto {
  @Expose()
  id: number;

  @Expose()
  type: NotificationType;

  @Expose()
  message: string;

  @Expose()
  isRead: boolean;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<ReturnedNotificationDto>) {
    Object.assign(this, partial);
  }
}
