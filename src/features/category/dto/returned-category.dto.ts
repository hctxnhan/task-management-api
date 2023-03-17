import { Expose } from 'class-transformer';

export class ReturnedCategoryDto {
  @Expose()
  id: number;
  @Expose()
  name: string;

  constructor(partial: Partial<ReturnedCategoryDto>) {
    Object.assign(this, partial);
  }
}
