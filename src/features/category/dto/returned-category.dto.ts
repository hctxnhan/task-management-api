import { Expose } from 'class-transformer';

export class ReturnedCategoryDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  groupId?: number;
  @Expose()
  priority: number;

  constructor(partial: Partial<ReturnedCategoryDto>) {
    Object.assign(this, partial);
  }
}
