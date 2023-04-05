import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateGroupJoinInvitationDto } from './dto/create-group-join-invitation.dto';
import { GroupJoinInvitationService } from './group-join-invitation.service';
import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { ResourceType } from '../authorization/resource-type.type';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { JoinGroupInvitationStatus } from '@/types/enum';

@ApiBearerAuth()
@ApiTags('Group Join Request')
@Controller('group-join-request')
@SetResourceType(ResourceType.GROUP_JOIN_INVITATION)
export class GroupJoinInvitationController {
  constructor(
    private readonly groupJoinInvitationService: GroupJoinInvitationService,
  ) {}

  @SetAuthorization(Permission.CREATE)
  @Post('request/:groupId')
  create(
    @Body() createGroupJoinInvitationDto: CreateGroupJoinInvitationDto,
    @CurrentUser() user: User,
  ) {
    return this.groupJoinInvitationService.create(
      createGroupJoinInvitationDto,
      user,
    );
  }

  @SetAuthorization(Permission.READ, PermissionScope.GROUP)
  @Get(':groupId')
  findAll(@Param('groupId') id: number) {
    return this.groupJoinInvitationService.findAll({
      where: {
        id,
      },
    });
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':id/reject')
  reject(@Param('id') id: number) {
    return this.groupJoinInvitationService.reject(id);
  }

  @SetAuthorization(Permission.UPDATE)
  @Post(':id/cancel')
  cancel(@Param('id') id: number) {
    return this.groupJoinInvitationService.cancel(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupJoinInvitationService.findOne(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':id/accept')
  accept(@Param('id') id: number) {
    return this.groupJoinInvitationService.accept(id);
  }

  @SetAuthorization(Permission.READ, PermissionScope.OWN)
  @Get('/my-requests')
  getAllMyRequests(@CurrentUser() user: User) {
    return this.groupJoinInvitationService.findAll({
      where: {
        ownerId: user.id,
        status: JoinGroupInvitationStatus.PENDING,
      },
    });
  }
}
