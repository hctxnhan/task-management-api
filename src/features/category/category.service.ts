import { Category } from '@/entities/category.entity';
import { User } from '@/entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, userId: currentUser.id },
    });

    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = new Category();
    category.name = createCategoryDto.name;
    category.user = currentUser;

    return this.categoryRepository.save(category);
  }

  findAll(filter: FindManyOptions) {
    return this.categoryRepository.find(filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
