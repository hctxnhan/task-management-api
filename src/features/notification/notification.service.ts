import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '@/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '@/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  findAll(filter: FindManyOptions<Notification>) {
    return this.notificationRepository.find(filter);
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  createNotification(createNotificationDto: CreateNotificationDto) {
    const { type, message, ownerId } = createNotificationDto;
    const notification = new Notification();

    notification.type = type;
    notification.message = message;
    notification.ownerId = ownerId;

    this.notificationRepository.save(notification);
  }

  async markAsRead(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    notification.isRead = true;
    this.notificationRepository.save(notification);
  }

  async markAllAsRead(lastNotificationId: number, user: User) {
    await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification."ownerId" = :ownerId', { ownerId: user.id })
      .andWhere('notification.id <= :lastNotificationId', {
        lastNotificationId,
      })
      .andWhere('notification."isRead" = false')
      .update()
      .set({ isRead: true })
      .execute();
  }
}
