import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseConfig } from '@/config/database';
// import { MockDatabaseModule } from './mock-database/mock-database.module';

@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig) /*MockDatabaseModule*/],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
