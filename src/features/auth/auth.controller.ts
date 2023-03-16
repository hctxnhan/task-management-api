import { Public } from '@/common/decorators/authorization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { User } from '@/entities/user.entity';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }
}
