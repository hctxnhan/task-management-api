import { Module } from '@nestjs/common';
import { GroupJoinInvitationService } from './group-join-invitation.service';
import { GroupJoinInvitationController } from './group-join-invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupJoinInvitation } from '@/entities/group-join-invitation';
import { Group } from '@/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupJoinInvitation, Group])],
  controllers: [GroupJoinInvitationController],
  providers: [GroupJoinInvitationService],
})
export class GroupJoinInvitationModule {}
