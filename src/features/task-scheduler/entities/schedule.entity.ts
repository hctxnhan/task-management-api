import { Task } from '@/entities/task.entity';
import { ScheduleSlot } from './schedule-slot.entity';

export class Schedule {
  scheduleSlots: ScheduleSlot[];
  constructor() {
    this.scheduleSlots = [];
  }

  // guarantee that the schedule slot is valid (start time is before end time and time range is fit the task and end date is before due date)
  addScheduleSlot(scheduleSlot: ScheduleSlot) {
    this.scheduleSlots.push(scheduleSlot);
  }

  removeScheduleSlot(scheduleSlot: ScheduleSlot) {
    this.scheduleSlots = this.scheduleSlots.filter((slot) => {
      return slot.task.id !== scheduleSlot.task.id;
    });
  }

  doesTaskExist(task: Task) {
    return this.scheduleSlots.some((scheduleSlot) => {
      return scheduleSlot.task.id === task.id;
    });
  }
}
