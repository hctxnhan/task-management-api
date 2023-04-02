import { Category } from '@/entities/category.entity';
import { Group } from '@/entities/group.entity';
import { Label } from '@/entities/label.entity';
import { Notification } from '@/entities/notification.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { ResourceType } from '@/features/authorization/resource-type.type';

export const resourceTypeToEntity = {
  [ResourceType.TASK]: Task,
  [ResourceType.USER]: User,
  [ResourceType.GROUP]: Group,
  [ResourceType.CATEGORY]: Category,
  [ResourceType.LABEL]: Label,
  [ResourceType.NOTIFICATION]: Notification,
};
