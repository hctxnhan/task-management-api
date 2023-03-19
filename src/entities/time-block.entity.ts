import { Time } from '@/features/task-scheduler/entities/time.entity';
import { Weekday } from '@/types/enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FreeTimeBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Weekday,
    default: Weekday.MONDAY,
  })
  weekday: Weekday;

  @Column({ type: 'string' })
  startOfBlock: Time;

  @Column({ type: 'string' })
  endOfBlock: Time;

  get duration(): number {
    return this.endOfBlock.duration - this.startOfBlock.duration;
  }

  get isValid(): boolean {
    return this.duration > 0;
  }

  constructor(weekday: Weekday, startOfBlock: Time, endOfBlock: Time) {
    this.weekday = weekday;
    this.startOfBlock = startOfBlock;
    this.endOfBlock = endOfBlock;
  }
}
