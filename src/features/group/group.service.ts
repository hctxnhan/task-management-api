import { Group } from '@/entities/group.entity';
import { User } from '@/entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Role } from '../authorization/role.type';
import { UserService } from '../user/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UserService,
  ) {}

  create(createGroupDto: CreateGroupDto, owner: User) {
    const group = new Group();
    group.name = createGroupDto.name;
    group.owner = owner;

    return this.groupRepository.save(group);
  }

  findAll(filter: FindManyOptions<Group>) {
    return this.groupRepository.find(filter);
  }

  findOne(id: number) {
    return this.groupRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  remove(id: number) {
    return this.groupRepository.delete(id);
  }

  async addMember(groupId: number, userId: number) {
    return this.groupRepository
      .createQueryBuilder()
      .relation(User, 'groups')
      .of(userId)
      .add(groupId);
  }

  async checkIfUserIsMember(groupId: number, userId: number) {
    return (
      (await this.groupRepository.count({
        where: {
          id: groupId,
          members: {
            id: userId,
          },
        },
      })) > 0
    );
  }

  async kickMember(groupId: number, userId: number, user: User) {
    // check if the user is the owner of the group
    const group = await this.findOne(groupId);
    if (group.owner.id !== user.id) {
      throw new ForbiddenException('Only owner can kick members');
    }

    return this.removeMember(groupId, userId);
  }

  async leaveGroup(groupId: number, userId: number) {
    // check if the user is the owner of the group
    const group = await this.findOne(groupId);
    if (group.owner.id === userId) {
      throw new BadRequestException('Owner cannot leave the group');
    }

    return this.removeMember(groupId, userId);
  }

  async removeMember(groupId: number, userId: number) {
    const isMember = await this.checkIfUserIsMember(groupId, userId);
    if (!isMember) {
      throw new BadRequestException('User is not a member of the group');
    }

    return this.groupRepository
      .createQueryBuilder()
      .relation(User, 'groups')
      .of(userId)
      .remove(groupId);
  }

  async checkGroupRole(groupId: number, userId: number) {
    let role: Role.GROUP_MEMBER | Role.GROUP_OWNER = null;
    const group = await this.findOne(groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isGroupOwner = group.ownerId === userId;
    if (isGroupOwner) {
      role = Role.GROUP_OWNER;
    } else {
      const isMemberOfGroup = this.checkIfUserIsMember(groupId, userId);

      if (isMemberOfGroup) {
        role = Role.GROUP_MEMBER;
      }
    }

    return role;
  }

  async getMembers(groupId: number) {
    return await this.userService.findAll({
      where: {
        groups: {
          id: groupId,
        },
      },
    });
  }
}
