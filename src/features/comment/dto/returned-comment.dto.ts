import { MinimalReturnedUserDto } from '@/features/user/dto/minimal-returned-user.dto';
import { Expose, Transform } from 'class-transformer';

export class ReturnedCommentDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => ({
    id: value.id,
    name: value.name,
  }))
  owner: MinimalReturnedUserDto;

  @Expose()
  taskId: number;

  constructor(partial: Partial<ReturnedCommentDto>) {
    Object.assign(this, partial);
  }
}
