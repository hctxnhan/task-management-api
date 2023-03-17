import { TaskStatus } from '@/types/enum';
import { Optional } from '@nestjs/common/decorators';
import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  dueDate: string;

  @IsInt({
    each: true,
  })
  @Optional()
  categories?: number[];

  @IsInt({
    each: true,
  })
  @Optional()
  labels?: number[];
}
