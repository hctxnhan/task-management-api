import { Task } from '@/entities/task.entity';
import { TimeSlot } from '../entities/time-slot.entity';

export interface Domain {
  task: Task;
  freeTimes: TimeSlot[];
}
