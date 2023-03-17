import { User } from '@/entities/user.entity';
import { checkPassword } from '@/utils/bcrypt-hash.util';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user = await this.userService.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) return null;

    const isValid = await checkPassword(plainPassword, user.password);

    if (isValid) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    const userExists = await this.userService.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const newUser = new User();
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.username = user.username;
    newUser.name = user.name;

    const userToLogin = await this.userService.create(newUser);
    return this.login(userToLogin);
  }
}
