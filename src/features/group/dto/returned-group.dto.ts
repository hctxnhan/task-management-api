import { Role } from '@/features/authorization/role.type';
import { Expose } from 'class-transformer';

export class ReturnedGroupDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  role?: Role.GROUP_MEMBER | Role.GROUP_OWNER;

  constructor(partial: Partial<ReturnedGroupDto>) {
    Object.assign(this, partial);
  }
}
