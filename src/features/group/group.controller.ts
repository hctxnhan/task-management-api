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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CreateGroupDto } from './dto/create-group.dto';
import { ReturnedGroupDto } from './dto/returned-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';
import { Role } from '../authorization/role.type';

@ApiBearerAuth()
@ApiTags('Group')
@SetResourceType(ResourceType.GROUP)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':groupId/leave')
  async leave(@Param('groupId') id: number, @CurrentUser() user: User) {
    await this.groupService.leaveGroup(id, user.id);
  }

  @SetAuthorization(Permission.READ, PermissionScope.OWN)
  @Get('/my-groups')
  async getMyGroups(@CurrentUser() user: User) {
    const allGroups = await this.groupService.findAll({
      where: [
        {
          ownerId: user.id,
        },
        {
          members: {
            id: user.id,
          },
        },
      ],
    });

    return allGroups.map(
      (group) =>
        new ReturnedGroupDto({
          ...group,
          role:
            group.ownerId === user.id ? Role.GROUP_OWNER : Role.GROUP_MEMBER,
        }),
    );
  }
  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':groupId/kick/:userId')
  async kick(
    @Param('groupId') id: number,
    @Param('userId') userId: number,
    @CurrentUser() user: User,
  ) {
    await this.groupService.kickMember(id, userId, user);
  }

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

  @SetAuthorization(Permission.READ)
  @Get()
  async findAll(@CurrentUser() user: User) {
    const groups = await this.groupService.findAll({
      where: {
        ownerId: user.id,
      },
    });

    return groups.map((group) => new ReturnedGroupDto(group));
  }

  @SetAuthorization(Permission.READ)
  @Get(':groupId')
  async findOne(@Param('groupId') id: number) {
    return new ReturnedGroupDto(await this.groupService.findOne(+id));
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Patch(':groupId')
  update(@Param('groupId') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @SetAuthorization(Permission.DELETE, PermissionScope.GROUP)
  @Delete(':groupId')
  remove(@Param('groupId') id: number) {
    return this.groupService.remove(+id);
  }
}
