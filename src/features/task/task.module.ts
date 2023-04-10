import { TASK_SCHEDULER_STRATEGY } from '@/common/tokens/tokens';
import { Task } from '@/entities/task.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';
import { NotificationModule } from '../notification/notification.module';
import { TaskSchedulerStrategy } from '../task-scheduler/interfaces/task-scheduler-strategy.enum';
import { TaskScheduler } from '../task-scheduler/task-scheduler';
import { UserModule } from '../user/user.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Task]),
    NotificationModule,
    GroupModule,
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskScheduler,
    {
      provide: TASK_SCHEDULER_STRATEGY,
      useValue: TaskSchedulerStrategy.BASED_ON_TASK_PRIORITY,
    },
  ],
})
export class TaskModule {}
