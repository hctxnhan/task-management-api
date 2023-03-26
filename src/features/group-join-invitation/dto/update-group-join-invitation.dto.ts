import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupJoinInvitationDto } from './create-group-join-invitation.dto';

export class UpdateGroupJoinInvitationDto extends PartialType(
  CreateGroupJoinInvitationDto,
) {}
