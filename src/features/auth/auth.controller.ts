import { Public } from '@/common/decorators/authorization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { User } from '@/entities/user.entity';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }
}
