import { Task } from '@/entities/task.entity';
import { FreeTimeBlock } from '@/entities/time-block.entity';

export interface Domain {
  task: Task;
  freeTimes: FreeTimeBlock[];
}
