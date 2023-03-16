import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@/types/enum';
import { isUserOwnResource } from '@/utils/user-own-resource.util';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';

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
  async findOne(@CurrentUser() user: User, @Param('id') id: number) {
    const task = await this.taskService.findOne(+id);
    if (!isUserOwnResource(user, task)) {
      throw new UnauthorizedException(
        'You are not allowed to access this resource',
      );
    }

    return task;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() status: TaskStatus) {
    return this.taskService.update(+id, {
      status,
    });
  }
}
