import { Group } from '@/entities/group.entity';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto, owner: User) {
    const group = new Group();
    group.name = createGroupDto.name;
    group.user = owner;

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
    });
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return this.groupRepository.delete(id);
  }
}
