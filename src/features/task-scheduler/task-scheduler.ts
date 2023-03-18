import { TASK_SCHEDULER_STRATEGY } from '@/common/tokens/tokens';
import { Task } from '@/entities/task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ScheduleSlot } from './entities/schedule-slot.entity';
import { Schedule } from './entities/schedule.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { Domain } from './interfaces/domain.interface';
import { TaskSchedulerStrategy } from './interfaces/task-scheduler-strategy.enum';
import { getTaskScore } from './utils/task-score.util';

@Injectable()
export class TaskScheduler {
  strategy: TaskSchedulerStrategy;

  constructor(
    @Inject(TASK_SCHEDULER_STRATEGY)
    private readonly taskSchedulerStrategy: TaskSchedulerStrategy,
  ) {
    this.strategy = taskSchedulerStrategy;
  }

  getDomainOfTask(task: Task, domains: Domain[]): TimeSlot[] {
    return (
      domains.find((domain) => domain.task.id === task.id)?.freeTimes ?? []
    );
  }

  findDomain(task: Task, freeTimes: TimeSlot[]): Domain {
    const timeSlots = freeTimes.filter((freeTime) => {
      return freeTime.duration >= task.duration && freeTime.isValid;
    });

    return { task, freeTimes: timeSlots };
  }

  schedule(tasks: Task[], freeTimes?: TimeSlot[]): Schedule | null | Task[] {
    if (this.strategy === TaskSchedulerStrategy.BASED_ON_TASK_PRIORITY) {
      return this.sortTaskByScore(tasks);
    }

    const domains = tasks.map((task) => this.findDomain(task, freeTimes));
    const schedule = new Schedule(tasks.length);
    const result = this.backtrack(schedule, tasks, domains);
    return result;
  }

  sortTaskByScore(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      return getTaskScore(b) - getTaskScore(a);
    });
  }

  backtrack(
    schedule: Schedule,
    tasks: Task[],
    domains: Domain[],
  ): Schedule | null {
    if (!schedule) return null;

    if (schedule.isComplete()) return schedule;

    const unassignedTask = tasks.find((task) => {
      return !schedule.doesTaskExist(task);
    });

    if (!unassignedTask) return schedule;

    const task = unassignedTask as Task;

    const possibleTimeSlots = this.getDomainOfTask(task, domains);

    for (let i = 0; i < possibleTimeSlots.length; i++) {
      const valid = schedule.addScheduleSlot(
        new ScheduleSlot(task, possibleTimeSlots[i]),
      );
      if (!valid) {
        schedule.removeScheduleSlot(
          new ScheduleSlot(task, possibleTimeSlots[i]),
        );
        continue;
      }

      if (this.constraints(schedule)) {
        const result = this.backtrack(schedule, tasks, domains);
        if (result) return result;
      }

      schedule.removeScheduleSlot(new ScheduleSlot(task, possibleTimeSlots[i]));
    }

    return null;
  }

  constraints(schedule: Schedule): boolean {
    const scheduleSlots = schedule.sortScheduleSlot();
    for (let i = 0; i < scheduleSlots.length - 1; i++) {
      const current = scheduleSlots[i];
      const next = scheduleSlots[i + 1];

      if (getTaskScore(current.task) < getTaskScore(next.task)) return false;
    }

    return true;
  }
}
