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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
import { Permission } from '../authorization/permission.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReturnedCategoryDto } from './dto/returned-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PermissionScope } from '../authorization/resource-owner.type';
import { CategoryPaginationDto } from './dto/category-pagination.dto';

@ApiBearerAuth()
@ApiTags('Category')
@SetResourceType(ResourceType.CATEGORY)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @SetAuthorization(Permission.CREATE, PermissionScope.ALL)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedCategoryDto(
      await this.categoryService.create(createCategoryDto, user),
    );
  }

  @SetAuthorization(Permission.READ, PermissionScope.ALL)
  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() paginationDto?: CategoryPaginationDto,
  ) {
    return await this.categoryService.pagination(paginationDto, user);
  }

  @SetAuthorization(Permission.READ, PermissionScope.ALL)
  @Get(':id')
  findOne(@CurrentResource() category: Category, @Param('id') id: number) {
    return new ReturnedCategoryDto(category);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.ALL)
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

  @SetAuthorization(Permission.DELETE, PermissionScope.ALL)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.categoryService.remove(id);
  }
}
