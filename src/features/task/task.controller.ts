import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SetResourceType } from '@/common/decorators/resource-type.decorator';
import { UserOwnResourceGuard } from '@/common/guards/user-own-resource.guard';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PriorityUpdateDto } from './dto/priority-update-dto';
import { ReturnedTaskDto } from './dto/returned-task.dto';
import { StatusUpdateDto } from './dto/status-update.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@SetResourceType(Task)
@UseGuards(UserOwnResourceGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('auto-schedule')
  async autoSchedule(@CurrentUser() user: User, @Query('hours') hours: number) {
    const tasks = await this.taskService.getAutoSchedule(user, hours);
    return {
      tasks: tasks.map((task) => new ReturnedTaskDto(task)),
      timeSpent: tasks.reduce((acc, task) => acc + task.duration, 0),
      numOfTasks: tasks.length,
    };
  }

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedTaskDto(
      await this.taskService.create(createTaskDto, user),
    );
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.taskService.findAll({
      where: {
        userId: user.id,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentResource() task: Task) {
    return new ReturnedTaskDto(task);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentResource() task: Task,
  ) {
    return this.taskService.update(id, updateTaskDto, task);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() statusUpdateDto: StatusUpdateDto,
  ) {
    await this.taskService.updateStatus(id, statusUpdateDto.status);
    return {
      message: 'Task status updated',
    };
  }

  @Patch(':id/priority')
  async updatePriority(
    @Param('id') id: number,
    @Body() priorityUpdateDto: PriorityUpdateDto,
  ) {
    await this.taskService.updatePriority(id, priorityUpdateDto.priority);
    return {
      message: 'Task priority updated',
    };
  }
}
