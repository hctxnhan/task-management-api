import { IsNumber } from 'class-validator';

export class CreateGroupJoinInvitationDto {
  @IsNumber()
  groupId: number;
}
