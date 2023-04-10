import { Expose } from 'class-transformer';

export class PaginationResultDto<T> {
  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  total: number;

  @Expose()
  data: T[];

  constructor(result: Partial<PaginationResultDto<T>>) {
    Object.assign(this, result);
  }
}
