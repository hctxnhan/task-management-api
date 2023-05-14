import { GroupJoinInvitation } from '@/entities/group-join-invitation';
import { User } from '@/entities/user.entity';
import { JoinGroupInvitationStatus, NotificationType } from '@/types/enum';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GroupJoinInvitationService {
  constructor(
    @InjectRepository(GroupJoinInvitation)
    private readonly groupJoinInvitationRepository: Repository<GroupJoinInvitation>,
    private readonly groupService: GroupService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(groupId: number, user: User) {
    const userId = user.id;
    // check if the user is already in the group
    const isMember = await this.groupService.checkIfUserIsMember(
      groupId,
      userId,
    );

    if (isMember) {
      throw new ConflictException('User is already in the group');
    }

    const invitation = new GroupJoinInvitation();
    invitation.groupId = groupId;
    invitation.ownerId = userId;
    invitation.status = JoinGroupInvitationStatus.PENDING;

    const res = await this.groupJoinInvitationRepository.save(invitation);
    await this.notificationService.createNotificationForGroupOwner(groupId, {
      message: `${user.username} wants to join your group ${res.groupId}}`,
      type: NotificationType.GROUP_JOIN_REQUEST,
    });

    return res;
  }

  findAll(filter: FindManyOptions<GroupJoinInvitation>) {
    return this.groupJoinInvitationRepository.find(filter);
  }

  findOne(id: number) {
    return this.groupJoinInvitationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async reject(id: number) {
    const invitation = await this.findOne(id);
    if (invitation.status !== JoinGroupInvitationStatus.PENDING) {
      throw new ConflictException('Invitation is not pending');
    }

    invitation.status = JoinGroupInvitationStatus.REJECTED;
    const res = await this.groupJoinInvitationRepository.save(invitation);
    await this.notificationService.createNotification({
      message: `Your request to join group ${res.groupId} has been rejected`,
      ownerId: res.ownerId,
      type: NotificationType.GROUP_JOIN_REQUEST_REJECTED,
    });
    return res;
  }

  async accept(id: number) {
    const invitation = await this.findOne(id);
    if (invitation.status !== JoinGroupInvitationStatus.PENDING) {
      throw new ConflictException('Invitation is not pending');
    }

    const isMember = await this.groupService.checkIfUserIsMember(
      invitation.groupId,
      invitation.ownerId,
    );

    if (isMember) {
      throw new ConflictException('User is already in the group');
    }

    invitation.status = JoinGroupInvitationStatus.ACCEPTED;
    const res = await this.groupJoinInvitationRepository.save(invitation);
    await this.notificationService.createNotification({
      message: `Your request to join group ${res.groupId} has been accepted`,
      ownerId: res.ownerId,
      type: NotificationType.GROUP_JOIN_REQUEST_ACCEPTED,
    });
    return this.groupService.addMember(invitation.groupId, invitation.ownerId);
  }

  async cancel(id: number) {
    const invitation = await this.findOne(id);
    if (!invitation) {
      throw new NotFoundException('Invitation does not exist');
    }

    if (invitation.status === JoinGroupInvitationStatus.PENDING) {
      return this.groupJoinInvitationRepository.delete(id);
    } else {
      throw new ConflictException('Invitation is not pending anymore!');
    }
  }
}
