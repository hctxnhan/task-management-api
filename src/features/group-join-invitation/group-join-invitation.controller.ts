import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateGroupJoinInvitationDto } from './dto/create-group-join-invitation.dto';
import { GroupJoinInvitationService } from './group-join-invitation.service';

@Controller('group-join-request')
export class GroupJoinInvitationController {
  constructor(
    private readonly groupJoinInvitationService: GroupJoinInvitationService,
  ) {}

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

  @Get(':groupId')
  findAll(@Param('groupId') id: number) {
    return this.groupJoinInvitationService.findAll({
      where: {
        id,
      },
    });
  }

  @Post(':id/reject')
  reject(@Param('id') id: number) {
    return this.groupJoinInvitationService.reject(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: number) {
    return this.groupJoinInvitationService.cancel(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupJoinInvitationService.findOne(id);
  }
}
