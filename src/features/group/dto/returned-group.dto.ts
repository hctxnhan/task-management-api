import { User } from '@/entities/user.entity';
import { ReturnedCategoryDto } from '@/features/category/dto/returned-category.dto';
import { ReturnedLabelDto } from '@/features/label/dto/returned-label.dto';
import { Expose } from 'class-transformer';

export class ReturnedGroupDto {
  @Expose()
  id: number;

  @Expose()
  user: User;

  @Expose()
  categories: ReturnedCategoryDto[];

  @Expose()
  labels: ReturnedLabelDto[];

  @Expose()
  name: string;

  constructor(partial: Partial<ReturnedGroupDto>) {
    Object.assign(this, partial);
  }
}
