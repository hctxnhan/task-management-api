import { Module } from '@nestjs/common';
import { FreeTimeService } from './free-time.service';
import { FreeTimeController } from './free-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeTimeBlock } from '@/entities/time-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreeTimeBlock])],
  controllers: [FreeTimeController],
  providers: [FreeTimeService],
})
export class FreeTimeModule {}
