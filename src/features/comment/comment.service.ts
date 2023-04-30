import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '@/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@/entities/comment.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly groupService: GroupService,
  ) {}

  create(taskId: number, createCommentDto: CreateCommentDto, user: User) {
    return this.commentRepository.save({
      ...createCommentDto,
      owner: user,
      task: { id: taskId },
    });
  }

  findAll(options: FindManyOptions<Comment>) {
    return this.commentRepository.find({
      ...options,
      relations: {
        owner: true,
      },
    });
  }

  findAllOfTask(taskId: number) {
    return this.findAll({
      where: {
        task: {
          id: taskId,
        },
      },
    });
  }

  findOne(id: number) {
    return this.commentRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
