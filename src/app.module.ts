import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { environmentConfig } from './config/environment';
import { AuthModule } from './features/auth/auth.module';
import { CategoryModule } from './features/category/category.module';
import { GroupModule } from './features/group/group.module';
import { LabelModule } from './features/label/label.module';
import { NotificationModule } from './features/notification/notification.module';
import { TaskModule } from './features/task/task.module';
import { UserModule } from './features/user/user.module';
import { TypeOrmConfigServiceService } from './type-orm-config-service/type-orm-config-service.service';
import { GroupJoinInvitationModule } from './features/group-join-invitation/group-join-invitation.module';
import { AuthorizationGuard } from './common/guards/authorization.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { IsValidColumnNameConstraint } from './common/decorators/valid-column-name.decorator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigServiceService,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      load: [environmentConfig],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    UserModule,
    LabelModule,
    CategoryModule,
    AuthModule,
    GroupModule,
    NotificationModule,
    GroupJoinInvitationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypeOrmConfigServiceService,
    IsValidColumnNameConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
