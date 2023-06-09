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
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PriorityUpdateDto } from './dto/priority-update-dto';
import { ReturnedTaskDto } from './dto/returned-task.dto';
import { StatusUpdateDto } from './dto/status-update.dto';
import { TaskPaginationDto } from './dto/task-pagination.dto';
import { UnassignTaskDto } from './dto/unassign-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('Task')
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

  @SetAuthorization(Permission.CREATE, PermissionScope.ALL)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return new ReturnedTaskDto(
      await this.taskService.create(createTaskDto, user),
    );
  }

  @SetAuthorization(Permission.READ, PermissionScope.ALL)
  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() paginationDto: TaskPaginationDto,
  ) {
    return await this.taskService.pagination(paginationDto, user);
  }

  @SetAuthorization(Permission.READ, PermissionScope.ALL)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return new ReturnedTaskDto(await this.taskService.findOne(id));
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.ALL)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentResource() task: Task,
  ) {
    return this.taskService.update(id, task, updateTaskDto);
  }

  @SetAuthorization(Permission.DELETE, PermissionScope.ALL)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.taskService.remove(id);
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.ALL)
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

  @SetAuthorization(Permission.UPDATE, PermissionScope.ALL)
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

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Patch(':id/assign')
  async assignTask(
    @Param('id') id: number,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    await this.taskService.assignTask(id, assignTaskDto);
    return {
      message: 'Task assigned',
    };
  }

  @SetAuthorization(Permission.UPDATE, PermissionScope.GROUP)
  @Patch(':id/unassign')
  async unassignTask(
    @Param('id') id: number,
    @Body() assignTaskDto: UnassignTaskDto,
  ) {
    await this.taskService.unassignTask(id, assignTaskDto.groupId);
    return {
      message: 'Task assigned',
    };
  }
}
