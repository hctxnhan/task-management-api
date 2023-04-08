import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/entities/task.entity';
import { UserModule } from '../user/user.module';
import { TaskScheduler } from '../task-scheduler/task-scheduler';
import { TASK_SCHEDULER_STRATEGY } from '@/common/tokens/tokens';
import { TaskSchedulerStrategy } from '../task-scheduler/interfaces/task-scheduler-strategy.enum';
import { NotificationModule } from '../notification/notification.module';
import { GroupModule } from '../group/group.module';

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
