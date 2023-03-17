import { Expose } from 'class-transformer';

export class ReturnedLabelDto {
  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  id: number;

  constructor(label: Partial<ReturnedLabelDto>) {
    Object.assign(this, label);
  }
}
