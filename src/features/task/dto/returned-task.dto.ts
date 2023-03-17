import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { ReturnedCategoryDto } from '@/features/category/dto/returned-category.dto';
import { ReturnedLabelDto } from '@/features/label/dto/returned-label.dto';
import { TaskStatus } from '@/types/enum';
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
  @Type(() => ReturnedLabelDto)
  labels: Label[];

  @Expose()
  @Type(() => ReturnedCategoryDto)
  category: Category;

  constructor(partial: Partial<ReturnedTaskDto>) {
    Object.assign(this, partial);
  }
}
