import {
  SetAuthorization,
  SetResourceType,
} from '@/common/decorators/authorization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '../authorization/permission.type';
import { PermissionScope } from '../authorization/resource-owner.type';
import { ResourceType } from '../authorization/resource-type.type';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReturnedCommentDto } from './dto/returned-comment.dto';

@ApiBearerAuth()
@ApiTags('Comment')
@SetResourceType(ResourceType.COMMENT)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @SetResourceType(ResourceType.TASK)
  @SetAuthorization(Permission.CREATE, PermissionScope.GROUP, {
    resourceId: 'taskId',
  })
  @Post(':taskId')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
    @Param('taskId') taskId: number,
  ) {
    const comment = await this.commentService.create(
      taskId,
      createCommentDto,
      user,
    );
    return new ReturnedCommentDto(comment);
  }

  @Get(':taskId')
  @SetResourceType(ResourceType.TASK)
  @SetAuthorization(Permission.READ, PermissionScope.GROUP, {
    resourceId: 'taskId',
  })
  async findAllOfTask(@Param('taskId') taskId: number) {
    const allComments = await this.commentService.findAllOfTask(taskId);
    return allComments.map((comment) => new ReturnedCommentDto(comment));
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  @SetAuthorization(Permission.DELETE, PermissionScope.OWN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.commentService.remove(+id);
  }
}
