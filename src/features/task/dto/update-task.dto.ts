import { TaskStatus } from '@/types/enum';
import { OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends OmitType(CreateTaskDto, [
  'groupId',
] as const) {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
