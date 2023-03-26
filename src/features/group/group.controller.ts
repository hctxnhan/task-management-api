import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { ReturnedGroupDto } from './dto/returned-group.dto';

@UseInterceptors(UserOwnResourceGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

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
        userId: user.id,
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
}
