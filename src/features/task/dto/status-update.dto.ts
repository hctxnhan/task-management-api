import { TaskStatus } from '@/types/enum';
import { IsEnum } from 'class-validator';

export class StatusUpdateDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
