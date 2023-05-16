import { GroupJoinInvitation } from '@/entities/group-join-invitation';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';
import { NotificationModule } from '../notification/notification.module';
import { GroupJoinInvitationController } from './group-join-invitation.controller';
import { GroupJoinInvitationService } from './group-join-invitation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupJoinInvitation]),
    GroupModule,
    NotificationModule,
  ],
  controllers: [GroupJoinInvitationController],
  providers: [GroupJoinInvitationService],
})
export class GroupJoinInvitationModule {}
