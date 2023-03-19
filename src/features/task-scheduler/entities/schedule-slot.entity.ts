import { Task } from '@/entities/task.entity';
import { FreeTimeBlock } from '@/entities/time-block.entity';

export class ScheduleSlot {
  task: Task;
  timeSlot: FreeTimeBlock;
  constructor(task: Task, freeTime: FreeTimeBlock) {
    this.task = task;
    this.timeSlot = freeTime;
  }
}
