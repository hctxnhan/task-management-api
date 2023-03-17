import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { SetResourceType } from '@/common/decorators/resource-type.decorator';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
import { Task } from '@/entities/task.entity';
import { TaskStatus } from '@/types/enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@SetResourceType(Task)
@UseGuards(UserOwnResourceGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentResource() task: Task) {
    return task;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: TaskStatus) {
    return this.taskService.update(id, { status });
  }
}
