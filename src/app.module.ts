import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environmentConfig } from './config/environment';
// import { MockDatabaseModule } from './mock-database/mock-database.module';
import { TypeOrmConfigServiceService } from './type-orm-config-service/type-orm-config-service.service';
import { TaskModule } from './features/task/task.module';
import { UserModule } from './features/user/user.module';
import { LabelModule } from './features/label/label.module';
import { CategoryModule } from './features/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigServiceService,
    }),
    // MockDatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      load: [environmentConfig],
    }),
    TaskModule,
    UserModule,
    LabelModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmConfigServiceService],
})
export class AppModule {}
