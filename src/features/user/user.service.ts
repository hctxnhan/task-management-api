import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Group } from '@/entities/group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async categoryAndLabelsIsValid(
    userId: number,
    labels: number[],
    category: number,
    groupId?: number,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const query = queryBuilder
      .select('COUNT(label.id)', 'count')
      .leftJoin('user.labels', 'label')
      .leftJoin('user.categories', 'category')
      .where('user.id = :userId', { userId })
      .andWhere('label.id IN (:...labels)', { labels })
      .andWhere('category.id = :category', { category });

    if (groupId) {
      query
        .andWhere('category.groupId = :groupIdCategory', {
          groupIdCategory: groupId,
        })
        .andWhere('label.groupId = :groupIdLabel', { groupIdLabel: groupId });
    }

    const result = await query.getRawOne();
    const count = Number(result['count']) ?? 0;
    return count > 0;
  }

  create(user: User) {
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(filter: FindOneOptions) {
    return this.userRepository.findOne(filter);
  }

  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async isUserInGroup(groupId: number, userId: number) {
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: userId,
    //     groups: {
    //       id: groupId,
    //     },
    //     ownedGroups: {
    //       ownerId: userId,
    //     },
    //   },
    //   relations: {
    //     groups: true,
    //     ownedGroups: true,
    //   },
    // });

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.groups', 'group')
      .leftJoin('user.ownedGroups', 'ownedGroup')
      .where('user.id = :userId', { userId })
      .andWhere((qb) => {
        qb.where('group.id = :groupId', { groupId }).orWhere(
          'ownedGroup.id = :groupId AND ownedGroup.ownerId = :userId',
        );
      });

    console.log(query.getSql());
    const user = await query.getOne();
    return user;
  }
}
