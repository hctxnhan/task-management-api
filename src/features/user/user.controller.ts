import { NoAuthorization } from '@/common/decorators/authorization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReturnedUserDto } from './dto/returned-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @NoAuthorization()
  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return new ReturnedUserDto(
      await this.userService.findOne({
        where: {
          id: user.id,
        },
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne({ where: { id } });
  }

  @NoAuthorization()
  @Patch()
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
}
