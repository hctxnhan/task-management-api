import { Column } from 'typeorm';

export class CreateGroupJoinInvitationDto {
  @Column()
  groupId: number;
}
