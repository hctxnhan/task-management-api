import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from '@/entities/label.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Label]), GroupModule],
  controllers: [LabelController],
  providers: [LabelService],
  exports: [LabelService],
})
export class LabelModule {}
