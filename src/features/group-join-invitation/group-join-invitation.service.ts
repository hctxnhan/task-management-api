import { GroupJoinInvitation } from '@/entities/group-join-invitation';
import { Group } from '@/entities/group.entity';
import { JoinGroupInvitationStatus } from '@/types/enum';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateGroupJoinInvitationDto } from './dto/create-group-join-invitation.dto';
import { User } from '@/entities/user.entity';
import { GroupService } from '../group/group.service';

@Injectable()
export class GroupJoinInvitationService {
  constructor(
    @InjectRepository(GroupJoinInvitation)
    private readonly groupJoinInvitationRepository: Repository<GroupJoinInvitation>,
    private readonly groupService: GroupService,
  ) {}

  async create(
    createGroupJoinInvitationDto: CreateGroupJoinInvitationDto,
    user: User,
  ) {
    const { groupId } = createGroupJoinInvitationDto;
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

    return this.groupJoinInvitationRepository.save(invitation);
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
    return this.groupJoinInvitationRepository.save(invitation);
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
    await this.groupJoinInvitationRepository.save(invitation);
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
