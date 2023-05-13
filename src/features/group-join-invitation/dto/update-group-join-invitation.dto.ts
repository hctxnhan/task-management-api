import { PartialType } from '@nestjs/swagger';
import { CreateGroupJoinInvitationDto } from './create-group-join-invitation.dto';

export class UpdateGroupJoinInvitationDto extends PartialType(
  CreateGroupJoinInvitationDto,
) {}
