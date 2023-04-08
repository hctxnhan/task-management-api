import { Expose } from 'class-transformer';

export class ReturnedUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  dateOfBirth?: Date;

  @Expose()
  name: string;

  constructor(user: Partial<ReturnedUserDto>) {
    Object.assign(this, user);
  }
}
