import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { Controller, Post, Param, Get, HttpCode } from '@nestjs/common';
import { ResourceType } from '../authorization/resource-type.type';
import { NotificationService } from './notification.service';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { ReturnedNotificationDto } from './dto/returned-notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
@SetResourceType(ResourceType.NOTIFICATION)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @SetAuthorization(Permission.READ, PermissionScope.OWN)
  @Get()
  async getNotifications(@CurrentUser() user: User) {
    const notifications = await this.notificationService.findAll({
      where: {
        ownerId: user.id,
      },
    });

    return notifications.map(
      (notification) => new ReturnedNotificationDto(notification),
    );
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.OWN)
  @HttpCode(204)
  @Post(':id/mark-as-read')
  markAsRead(@Param('id') id: number) {
    this.notificationService.markAsRead(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.OWN)
  @HttpCode(204)
  @Post(':id/mark-all-as-read')
  async markAllAsRead(@Param('id') id: number, @CurrentUser() user: User) {
    await this.notificationService.markAllAsRead(id, user);
  }
}
