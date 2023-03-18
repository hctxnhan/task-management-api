import { Task } from '@/entities/task.entity';
import { TimeSlot } from './time-slot.entity';

export class ScheduleSlot {
  task: Task;
  timeSlot: TimeSlot;
  constructor(task: Task, freeTime: TimeSlot) {
    this.task = task;
    this.timeSlot = freeTime;
  }

  get isValid() {
    return (
      this.task.dueDate.getTime() - this.timeSlot.end.getTime() >= 0 &&
      this.timeSlot.duration >= this.task.duration
    );
  }
}
