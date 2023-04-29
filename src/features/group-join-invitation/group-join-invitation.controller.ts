import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
import { ReturnedGroupJoinInvitationDto } from './dto/returned-group-join-invitation.dto';

@ApiBearerAuth()
@ApiTags('Group Join Request')
@Controller('group-join-request')
@SetResourceType(ResourceType.GROUP_JOIN_INVITATION)
export class GroupJoinInvitationController {
  constructor(
    private readonly groupJoinInvitationService: GroupJoinInvitationService,
  ) {}

  @SetAuthorization(Permission.READ, PermissionScope.OWN)
  @Get('/my-requests')
  async getAllMyRequests(@CurrentUser() user: User) {
    const allMyInvitations = await this.groupJoinInvitationService.findAll({
      where: {
        ownerId: user.id,
        status: JoinGroupInvitationStatus.PENDING,
      },
      relations: ['owner'],
    });

    return allMyInvitations.map((invitation) => {
      return new ReturnedGroupJoinInvitationDto({
        ...invitation,
        requestBy: invitation.owner,
      });
    });
  }

  @SetAuthorization(Permission.CREATE)
  @Post('request/:groupId')
  async create(
    @Body() createGroupJoinInvitationDto: CreateGroupJoinInvitationDto,
    @CurrentUser() user: User,
  ) {
    await this.groupJoinInvitationService.create(
      createGroupJoinInvitationDto,
      user,
    );
  }

  @SetAuthorization(Permission.READ, PermissionScope.GROUP)
  @Get(':groupId')
  async findAll(@Param('groupId') id: number) {
    const allInvitations = await this.groupJoinInvitationService.findAll({
      where: {
        groupId: id,
      },
      relations: ['owner'],
    });
    return allInvitations.map(
      (invitation) =>
        new ReturnedGroupJoinInvitationDto({
          ...invitation,
          requestBy: invitation.owner,
        }),
    );
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':id/reject')
  async reject(@Param('id') id: number) {
    await this.groupJoinInvitationService.reject(id);
  }

  @SetAuthorization(Permission.UPDATE)
  @Post(':id/cancel')
  async cancel(@Param('id') id: number) {
    await this.groupJoinInvitationService.cancel(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupJoinInvitationService.findOne(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Post(':id/accept')
  async accept(@Param('id') id: number) {
    await this.groupJoinInvitationService.accept(id);
  }
}
