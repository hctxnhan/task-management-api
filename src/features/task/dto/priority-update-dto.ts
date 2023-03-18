import { TaskPriority } from '@/types/enum';
import { IsEnum } from 'class-validator';

export class PriorityUpdateDto {
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
