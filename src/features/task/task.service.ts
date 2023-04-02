import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { NotificationType, TaskPriority, TaskStatus } from '@/types/enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { TaskScheduler } from '../task-scheduler/task-scheduler';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationGateway } from '../notification/notification.gateway';
import { Notification } from '@/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly taskSchedulerService: TaskScheduler,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) {}

  // create a cron that run every hour and check if there is any task that will be due within the next hour
  // if there is, send a notification to the user that owns the task
  @Cron(CronExpression.EVERY_HOUR)
  async checkForDueTasks() {
    console.log('CRON: -- Checking for due tasks --');
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.status = :status', { status: TaskStatus.TODO })
      .andWhere('task.dueDate > :now', { now: new Date() })
      .andWhere('task.dueDate < :oneHourLater', {
        oneHourLater: new Date(new Date().getTime() + 60 * 60 * 1000),
      })
      .getMany();

    tasks.forEach((task) => {
      const notification = new Notification();
      notification.type = NotificationType.TASK_DUE;
      notification.message = `Task ${task.title} is due`;
      notification.ownerId = task.ownerId;
      notification.isRead = false;

      this.notificationService.createNotification(notification);

      this.notificationGateway.emitNotificationToUser(
        task.ownerId,
        notification,
      );
    });
  }

  async create(createTaskDto: CreateTaskDto, user: User) {
    const { description, dueDate, title, categoryId, labels, priority } =
      createTaskDto;

    const isValid = await this.userService.categoryAndLabelsIsValid(
      user.id,
      labels,
      categoryId,
    );

    if (!isValid) {
      throw new NotFoundException('Invalid category or labels');
    }

    const task = new Task();
    task.dueDate = new Date(dueDate);
    task.description = description;
    task.title = title;
    task.status = TaskStatus.TODO;
    task.ownerId = user.id;
    task.categoryId = categoryId;
    task.priority = priority;

    task.labels = labels.map((label) => {
      const labelEntity = new Label();
      labelEntity.id = label;

      return labelEntity;
    });

    return this.taskRepository.save(task);
  }

  findAll(filter: FindManyOptions<Task>) {
    return this.taskRepository.find(filter);
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    throw new Error('Method not implemented.');
  }

  updateStatus(id: number, status: TaskStatus) {
    this.taskRepository.update(id, { status });
  }

  updatePriority(id: number, priority: TaskPriority) {
    this.taskRepository.update(id, { priority });
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }

  async getAutoSchedule(user: User, hours: number) {
    const tasks = await this.findAll({
      where: {
        ownerId: user.id,
        dueDate: MoreThan(new Date()),
        status: TaskStatus.TODO,
      },
    });

    return this.taskSchedulerService.schedule(tasks, hours);
  }
}
