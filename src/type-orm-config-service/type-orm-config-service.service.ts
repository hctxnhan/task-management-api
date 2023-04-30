import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Group } from '@/entities/group.entity';
import { GroupJoinInvitation } from '@/entities/group-join-invitation';
import { Notification } from '@/entities/notification.entity';
import { Comment } from '@/entities/comment.entity';
@Injectable()
export class TypeOrmConfigServiceService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      schema: this.configService.get<string>('database.schema'),
      synchronize: true,
      logging: false,
      subscribers: [],
      entities: [
        User,
        Label,
        Task,
        Category,
        Group,
        GroupJoinInvitation,
        Notification,
        Comment,
      ],
    };
  }
}
