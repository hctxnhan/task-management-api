import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashedPassword } from '@/utils/bcrypt-hash.util';

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

  findAll(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  findOne(filter: FindOneOptions) {
    return this.userRepository.findOne(filter);
  }

  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      const hashed = await hashedPassword(password);
      updateUserDto.password = hashed;
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async isUserInGroup(groupId: number, userId: number) {
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

    const user = await query.getOne();
    return user;
  }
}
