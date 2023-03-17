import { Label } from '@/entities/label.entity';
import { User } from '@/entities/user.entity';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label) private labelRepository: Repository<Label>,
  ) {}

  async create(createLabelDto: CreateLabelDto, owner: User) {
    const existingLabel = await this.labelRepository.findOne({
      where: { name: createLabelDto.name, userId: owner.id },
    });

    if (existingLabel) {
      throw new ConflictException('Label already exists');
    }

    const label = new Label();
    label.name = createLabelDto.name;
    label.color = createLabelDto.color;
    label.user = owner;
    label.userId = owner.id;
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
}
