import { TaskPriority } from '@/types/enum';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: string;

  @IsInt()
  categoryId: number;

  @IsNumber()
  duration: number;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsInt({
    each: true,
  })
  @IsOptional()
  labels?: number[];

  @IsInt()
  @IsOptional()
  groupId?: number;
}
