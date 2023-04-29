import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { NotificationType, TaskPriority, TaskStatus } from '@/types/enum';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Like, MoreThan, Repository } from 'typeorm';
import { TaskScheduler } from '../task-scheduler/task-scheduler';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationGateway } from '../notification/notification.gateway';
import { Notification } from '@/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { GroupService } from '../group/group.service';
import { TaskPaginationDto } from './dto/task-pagination.dto';
import { PaginationResultDto } from '@/common/dto/pagination-result.dto';
import { ReturnedTaskDto } from './dto/returned-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly taskSchedulerService: TaskScheduler,
    private readonly groupService: GroupService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkForDueTasks() {
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
    const {
      description,
      dueDate,
      title,
      categoryId,
      labels,
      priority,
      groupId,
      duration,
    } = createTaskDto;

    const isValid = await this.userService.categoryAndLabelsIsValid(
      user.id,
      labels,
      categoryId,
      createTaskDto.groupId,
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
    task.groupId = groupId;
    task.duration = duration;

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

  async pagination(taskPaginationDto: TaskPaginationDto, user: User) {
    const { limit, order, orderBy, page, search, status, groupId } =
      taskPaginationDto;
    const [result, count] = await this.taskRepository.findAndCount({
      where: {
        ownerId: user.id,
        status,
        title: search ? Like(`%${search}%`) : undefined,
        group: groupId ? { id: groupId } : { id: IsNull() },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [orderBy]: order,
      },
    });

    return new PaginationResultDto<ReturnedTaskDto>({
      data: result.map((task) => new ReturnedTaskDto(task)),
      limit,
      page,
      total: count,
    });
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  update(id: number, currentTast: Task, updateTaskDto: UpdateTaskDto) {
    const {
      description,
      dueDate,
      title,
      categoryId,
      labels,
      priority,
      duration,
      status,
    } = updateTaskDto;

    const isValid = this.userService.categoryAndLabelsIsValid(
      currentTast.ownerId,
      labels,
      categoryId,
      currentTast.groupId,
    );

    if (!isValid) {
      throw new NotFoundException('Invalid category or labels');
    }

    currentTast.dueDate = new Date(dueDate);
    currentTast.description = description;
    currentTast.title = title;
    currentTast.categoryId = categoryId;
    currentTast.priority = priority;
    currentTast.duration = duration;
    currentTast.status = status;

    currentTast.labels = labels.map((label) => {
      const labelEntity = new Label();
      labelEntity.id = label;

      return labelEntity;
    });

    return this.taskRepository.save(currentTast);
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

  async assignTask(id: number, assignTaskDto: AssignTaskDto) {
    const { groupId, userId } = assignTaskDto;
    const user = await this.userService.isUserInGroup(groupId, userId);

    if (!user) {
      throw new NotFoundException('User not found in group');
    }

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (task.ownerId !== assignTaskDto.userId) {
      throw new ConflictException('Task is already assigned to another user');
    }

    task.assignee = user;

    const result = await this.taskRepository.save(task);
    const notification = await this.notificationService.createNotification({
      ownerId: assignTaskDto.userId,
      message: `Task ${task.title} is assigned to you`,
      type: NotificationType.TASK_ASSIGNED,
    });

    this.notificationGateway.emitNotificationToUser(
      assignTaskDto.userId,
      notification,
    );

    return result;
  }

  async unassignTask(id: number, groupId: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.assignee = null;
    return this.taskRepository.save(task);
  }

  async createTaskInGroup(
    groupId: number,
    createTaskDto: CreateTaskDto,
    user: User,
  ) {
    return this.create(
      {
        ...createTaskDto,
        groupId,
      },
      user,
    );
  }
}
