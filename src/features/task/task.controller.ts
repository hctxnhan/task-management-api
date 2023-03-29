import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { CurrentResource } from '@/common/decorators/current-resource.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
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
} from '@nestjs/common';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { Role } from '../authorization/role.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { PriorityUpdateDto } from './dto/priority-update-dto';
import { ReturnedTaskDto } from './dto/returned-task.dto';
import { StatusUpdateDto } from './dto/status-update.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@SetResourceType(ResourceType.TASK)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @SetAuthorization(Permission.READ)
  @Get('auto-schedule')
  async autoSchedule(@CurrentUser() user: User, @Query('hours') hours: number) {
    const tasks = await this.taskService.getAutoSchedule(user, hours);
    return {
      tasks: tasks.map((task) => new ReturnedTaskDto(task)),
      timeSpent: tasks.reduce((acc, task) => acc + task.duration, 0),
      numOfTasks: tasks.length,
    };
  }

  @SetAuthorization(Permission.CREATE)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedTaskDto(
      await this.taskService.create(createTaskDto, user),
    );
  }

  @SetAuthorization(Permission.READ)
  @Get()
  async findAll(@CurrentUser() user: User) {
    const tasks = await this.taskService.findAll({
      where: {
        ownerId: user.id,
      },
    });

    return tasks.map((task) => new ReturnedTaskDto(task));
  }

  @SetAuthorization(Permission.READ)
  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentResource() task: Task) {
    return new ReturnedTaskDto(task);
  }

  @SetAuthorization(Permission.UPDATE)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @SetAuthorization(Permission.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @SetAuthorization(Permission.UPDATE)
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

  @SetAuthorization(Permission.UPDATE)
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
