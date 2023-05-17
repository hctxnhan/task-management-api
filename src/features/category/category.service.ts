import { PaginationResultDto } from '@/common/dto/pagination-result.dto';
import { Category } from '@/entities/category.entity';
import { User } from '@/entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';
import { CategoryPaginationDto } from './dto/category-pagination.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReturnedCategoryDto } from './dto/returned-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly groupService: GroupService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
        ownerId: currentUser.id,
        groupId: createCategoryDto.groupId || null,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = new Category();
    category.name = createCategoryDto.name;

    if (createCategoryDto.groupId) {
      category.groupId = createCategoryDto.groupId;
    }

    category.owner = currentUser;

    return this.categoryRepository.save(category);
  }

  findAll(filter: FindManyOptions<Category>) {
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

  async pagination(paginationDto: CategoryPaginationDto, user: User) {
    const { limit, order, orderBy, page, search, priority, groupId } =
      paginationDto;

    if (groupId) {
      const isMember =
        (await this.groupService.checkGroupRole(groupId, user.id)) !== null;

      if (!isMember) {
        throw new NotFoundException('Group not found');
      }
    }

    const [result, count] = await this.categoryRepository.findAndCount({
      where: {
        ownerId: groupId ? undefined : user.id,
        name: search ? Like(`%${search}%`) : undefined,
        priority,
        group: {
          id: groupId,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy ?? 'id']: order ?? 'ASC',
      },
    });

    return new PaginationResultDto<ReturnedCategoryDto>({
      data: result.map((task) => new ReturnedCategoryDto(task)),
      limit,
      page,
      total: count,
    });
  }
}
