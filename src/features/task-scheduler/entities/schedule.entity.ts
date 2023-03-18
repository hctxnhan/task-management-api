import { Task } from '@/entities/task.entity';
import { checkIfTwoTimeRangeOverlap } from '../utils/check-if-time-range-overlap.util';
import { ScheduleSlot } from './schedule-slot.entity';

export class Schedule {
  scheduleSlots: ScheduleSlot[];
  numOfTask: number;
  constructor(numOfTask: number) {
    this.scheduleSlots = [];
    this.numOfTask = numOfTask;
  }

  // guarantee that the schedule slot is valid (start time is before end time and time range is fit the task and end date is before due date)
  addScheduleSlot(scheduleSlot: ScheduleSlot): boolean {
    if (scheduleSlot.timeSlot.isValid && scheduleSlot.isValid) {
      if (
        this.scheduleSlots.some((slot) =>
          checkIfTwoTimeRangeOverlap(slot.timeSlot, scheduleSlot.timeSlot),
        )
      )
        return false;

      this.scheduleSlots.push(scheduleSlot);
      return true;
    }
    return false;
  }

  removeScheduleSlot(scheduleSlot: ScheduleSlot) {
    this.scheduleSlots = this.scheduleSlots.filter((slot) => {
      return slot.task.id !== scheduleSlot.task.id;
    });
  }

  isComplete() {
    return this.scheduleSlots.length === this.numOfTask;
  }

  doesTaskExist(task: Task) {
    return this.scheduleSlots.some((scheduleSlot) => {
      return scheduleSlot.task.id === task.id;
    });
  }

  sortScheduleSlot() {
    return [...this.scheduleSlots].sort((a, b) => {
      return a.timeSlot.start.getTime() - b.timeSlot.start.getTime();
    });
  }
}
