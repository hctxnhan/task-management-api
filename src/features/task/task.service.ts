import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const { description, dueDate, title, categories, labels } = createTaskDto;
    const task = new Task();
    task.dueDate = new Date(dueDate);
    task.description = description;
    task.title = title;

    task.categories = categories.map((category) => {
      const categoryEntity = new Category();
      categoryEntity.id = category;

      return categoryEntity;
    });

    task.labels = labels.map((label) => {
      const labelEntity = new Label();
      labelEntity.id = label;

      return labelEntity;
    });

    return this.taskRepository.save(task);
  }

  findMany(options: FindManyOptions) {
    return this.taskRepository.find(options);
  }

  findAll() {
    return this.findMany({});
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return {};
  }
}
