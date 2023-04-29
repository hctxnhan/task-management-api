import { IsValidColumnNameConstraint } from '@/common/decorators/valid-column-name.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsNumber, IsOptional, Validate } from 'class-validator';

export class CategoryPaginationDto extends PaginationDto {
  @IsOptional()
  @Validate(IsValidColumnNameConstraint, ['Category'], {})
  orderBy?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;
}
