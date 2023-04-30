import { User } from '@/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class MinimalReturnedUserDto extends PickType(User, ['id', 'name']) {}
