import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Category } from '@/entities/category.entity';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReturnedCategoryDto } from './dto/returned-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('Category')
@SetResourceType(ResourceType.CATEGORY)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedCategoryDto(
      await this.categoryService.create(createCategoryDto, user),
    );
  }

  @SetAuthorization(Permission.READ, PermissionScope.GROUP)
  @Get()
  async findAll(@CurrentUser() user: User) {
    const all = await this.categoryService.findAll({
      where: {
        ownerId: user.id,
        groupId: IsNull(),
      },
    });

    return all.map((category) => new ReturnedCategoryDto(category));
  }

  @Get(':id')
  findOne(@CurrentResource() category: Category) {
    return new ReturnedCategoryDto(category);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentResource() category: Category,
  ) {
    await this.categoryService.update(id, updateCategoryDto);
    return new ReturnedCategoryDto({
      ...category,
      ...updateCategoryDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.categoryService.remove(id);
  }
}
