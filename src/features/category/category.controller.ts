import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SetResourceType } from '@/common/decorators/resource-type.decorator';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReturnedCategoryDto } from './dto/returned-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(UserOwnResourceGuard)
@SetResourceType(Category)
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

  @Get()
  async findAll(@CurrentUser() user: User) {
    const all = await this.categoryService.findAll({
      where: {
        userId: user.id,
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
