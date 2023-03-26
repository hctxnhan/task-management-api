import { Module } from '@nestjs/common';
import { GroupJoinInvitationService } from './group-join-invitation.service';
import { GroupJoinInvitationController } from './group-join-invitation.controller';

@Module({
  controllers: [GroupJoinInvitationController],
  providers: [GroupJoinInvitationService]
})
export class GroupJoinInvitationModule {}
