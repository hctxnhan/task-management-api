import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { CreateLabelDto } from '../label/dto/create-label.dto';
import { LabelService } from '../label/label.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ReturnedGroupDto } from './dto/returned-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@SetResourceType(ResourceType.GROUP)
@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly categoryService: CategoryService,
    private readonly labelService: LabelService,
  ) {}

  @SetAuthorization(Permission.CREATE)
  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedGroupDto(
      await this.groupService.create(createGroupDto, user),
    );
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.groupService.findAll({
      where: {
        ownerId: user.id,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupService.remove(+id);
  }

  @SetResourceType(ResourceType.CATEGORY)
  @SetAuthorization(Permission.CREATE, PermissionScope.GROUP)
  @Post(':groupId/category')
  async createCategory(
    @Param('groupId') id: number,
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return await this.categoryService.create(
      {
        ...createCategoryDto,
        groupId: id,
      },
      user,
    );
  }

  @SetResourceType(ResourceType.LABEL)
  @SetAuthorization(Permission.CREATE, PermissionScope.GROUP)
  @Post(':groupId/label')
  async createLabel(
    @Param('groupId') id: number,
    @Body() createLabelDto: CreateLabelDto,
    @CurrentUser() user: User,
  ) {
    return await this.labelService.create(
      {
        ...createLabelDto,
        groupId: id,
      },
      user,
    );
  }
}
