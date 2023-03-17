import { Optional } from '@nestjs/common/decorators';
import { IsDateString, IsInt, IsString } from 'class-validator';

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

  @IsInt({
    each: true,
  })
  @Optional()
  labels?: number[];
}
