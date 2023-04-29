import { IsValidColumnNameConstraint } from '@/common/decorators/valid-column-name.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { TaskStatus } from '@/types/enum';
import { IsEnum, IsOptional, Validate } from 'class-validator';

export class TaskPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @Validate(IsValidColumnNameConstraint, ['Task'], {})
  orderBy?: string = 'priority';

  @IsOptional()
  search?: string;

  @IsOptional()
  priority?: number;

  @IsOptional()
  categoryId?: number;
}
