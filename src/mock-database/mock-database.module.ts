import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockDatabaseService } from './mock-database.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Category, Label])],
  providers: [MockDatabaseService],
})
export class MockDatabaseModule {}
