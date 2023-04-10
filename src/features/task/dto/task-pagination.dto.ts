import { IsValidColumnNameConstraint } from '@/common/decorators/valid-column-name.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { TaskStatus } from '@/types/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Validate } from 'class-validator';

export class TaskPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate(IsValidColumnNameConstraint, ['Task'], {})
  orderBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}
