import { User } from '@/entities/user.entity';
import { JoinGroupInvitationStatus } from '@/types/enum';
import { Expose, Transform } from 'class-transformer';

export class ReturnedGroupJoinInvitationDto {
  @Expose()
  @Transform(({ value }: { value: User }) => {
    return { userId: value.id, name: value.name };
  })
  requestBy: User;

  @Expose()
  id: number;

  @Expose()
  groupId: number;

  @Expose()
  status: JoinGroupInvitationStatus;

  constructor(partial: Partial<ReturnedGroupJoinInvitationDto>) {
    Object.assign(this, partial);
  }
}
