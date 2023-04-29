import { Label } from '@/entities/label.entity';
import { User } from '@/entities/user.entity';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelPaginationDto } from './dto/label-pagination.dto';
import { PaginationResultDto } from '@/common/dto/pagination-result.dto';
import { ReturnedLabelDto } from './dto/returned-label.dto';
@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label) private labelRepository: Repository<Label>,
  ) {}

  async create(createLabelDto: CreateLabelDto, owner: User) {
    const existingLabel = await this.labelRepository.findOne({
      where: {
        name: createLabelDto.name,
        ownerId: owner.id,
        groupId: createLabelDto.groupId || null,
      },
    });

    if (existingLabel) {
      throw new ConflictException('Label already exists');
    }

    const label = new Label();
    label.name = createLabelDto.name;
    label.color = createLabelDto.color;
    label.owner = owner;

    if (createLabelDto.groupId) {
      label.groupId = createLabelDto.groupId;
    }

    await this.labelRepository.save(label);
    return label;
  }

  findAll(filter: FindManyOptions<Label> = {}) {
    return this.labelRepository.find(filter);
  }

  findOne(id: number) {
    return this.labelRepository.findOne({ where: { id } });
  }

  update(id: number, updateLabelDto: UpdateLabelDto) {
    return this.labelRepository.update(id, updateLabelDto);
  }

  remove(id: number) {
    return this.labelRepository.delete(id);
  }

  async pagination(paginationDto: LabelPaginationDto, user: User) {
    const { limit, order, orderBy, page, search, groupId } = paginationDto;
    const [result, count] = await this.labelRepository.findAndCount({
      where: {
        ownerId: user.id,
        name: search ? Like(`%${search}%`) : undefined,
        groupId: groupId,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy ?? 'id']: order ?? 'ASC',
      },
    });

    return new PaginationResultDto<ReturnedLabelDto>({
      data: result.map((task) => new ReturnedLabelDto(task)),
      limit,
      page,
      total: count,
    });
  }
}
