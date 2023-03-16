import { TaskStatus } from '@/types/enum';
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
  categories: number[];

  @IsInt({
    each: true,
  })
  labels: number[];
}
