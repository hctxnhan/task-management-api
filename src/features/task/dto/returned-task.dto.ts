import { ReturnedLabelDto } from '@/features/label/dto/returned-label.dto';
import { ReturnedUserDto } from '@/features/user/dto/returned-user.dto';
import { TaskPriority, TaskStatus } from '@/types/enum';
import { Expose, Type } from 'class-transformer';

export class ReturnedTaskDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Date)
  dueDate: Date;

  @Expose()
  status: TaskStatus;

  @Expose()
  duration: number;

  @Expose()
  @Type(() => ReturnedLabelDto)
  labels: ReturnedLabelDto[];

  @Expose()
  categoryId: number;

  @Expose()
  priority: TaskPriority;

  @Expose()
  groupId?: number;

  @Expose()
  @Type(() => ReturnedUserDto)
  assignee: ReturnedUserDto;

  constructor(partial: Partial<ReturnedTaskDto>) {
    Object.assign(this, partial);
  }
}
