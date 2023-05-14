import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '@/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { GroupService } from '../group/group.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private groupService: GroupService,
  ) {}

  findAll(filter: FindManyOptions<Notification>) {
    return this.notificationRepository.find(filter);
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  createNotification(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.save(createNotificationDto);
  }

  async createNotificationForGroupOwner(
    groupId: number,
    createNotificationDto: Omit<CreateNotificationDto, 'ownerId'>,
  ) {
    const group = await this.groupService.findOne(groupId);
    const groupOwnerId = group.ownerId;

    return this.notificationRepository.save({
      ...createNotificationDto,
      ownerId: groupOwnerId,
    });
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
