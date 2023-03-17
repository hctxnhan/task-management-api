import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async categoryAndLabelsIsValid(
    userId: number,
    labels: number[],
    category: number,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const result = await queryBuilder
      .select('COUNT(label.id)', 'count')
      .leftJoin('user.labels', 'label')
      .leftJoin('user.categories', 'category')
      .where('user.id = :userId', { userId })
      .andWhere('label.id IN (:...labels)', { labels })
      .andWhere('category.id = :category', { category })
      .getRawOne<{ count: string }>();

    const count = Number(result.count) ?? 0;

    return count === labels.length;
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
}
