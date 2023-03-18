import { TaskPriority } from '@/types/enum';
import { Optional } from '@nestjs/common/decorators';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
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
  @Optional()
  categoryId?: number;

  @Optional()
  @IsNumber()
  duration?: number;

  @IsEnum(TaskPriority)
  @Optional()
  priority?: TaskPriority;

  @IsInt({
    each: true,
  })
  @Optional()
  labels?: number[];
}
