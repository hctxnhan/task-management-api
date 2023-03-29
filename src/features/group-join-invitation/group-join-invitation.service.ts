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

@Injectable()
export class GroupJoinInvitationService {
  constructor(
    @InjectRepository(GroupJoinInvitation)
    private readonly groupJoinInvitationRepository: Repository<GroupJoinInvitation>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(
    createGroupJoinInvitationDto: CreateGroupJoinInvitationDto,
    user: User,
  ) {
    // check if the user is already in the group
    const group = await this.groupRepository.count({
      where: {
        id: createGroupJoinInvitationDto.groupId,
        members: {
          id: user.id,
        },
      },
      relations: ['users'],
    });

    if (group > 0) {
      throw new ConflictException('User is already in the group');
    }

    const invitation = new GroupJoinInvitation();
    invitation.groupId = createGroupJoinInvitationDto.groupId;
    invitation.ownerId = user.id;
    invitation.status = JoinGroupInvitationStatus.PENDING;
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
    const group = await this.groupRepository.count({
      where: {
        id: invitation.groupId,
        members: {
          id: invitation.ownerId,
        },
      },
      relations: ['users'],
    });

    if (group > 0) {
      throw new ConflictException('User is already in the group');
    }

    invitation.status = JoinGroupInvitationStatus.ACCEPTED;
    return this.groupJoinInvitationRepository.save(invitation);
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
