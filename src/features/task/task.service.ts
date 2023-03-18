import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { TaskPriority, TaskStatus } from '@/types/enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { TaskScheduler } from '../task-scheduler/task-scheduler';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly taskSchedulerService: TaskScheduler,
  ) {}

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
    task.userId = user.id;
    task.categoryId = categoryId;
    task.priority = priority;

    task.labels = labels.map((label) => {
      const labelEntity = new Label();
      labelEntity.id = label;

      return labelEntity;
    });

    return this.taskRepository.save(task);
  }

  findAll(filter: FindManyOptions) {
    return this.taskRepository.find(filter);
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto, currentTask: Task) {
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

  async getAutoSchedule(user: User) {
    const tasks = await this.findAll({
      where: {
        userId: user.id,
      },
      relations: {
        labels: true,
      },
    });

    return this.taskSchedulerService.schedule(tasks);
  }
}
