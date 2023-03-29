import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '@/entities/group.entity';
import { CategoryModule } from '../category/category.module';
import { LabelModule } from '../label/label.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), CategoryModule, LabelModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
