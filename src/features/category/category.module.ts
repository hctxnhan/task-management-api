import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/entities/category.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), GroupModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
