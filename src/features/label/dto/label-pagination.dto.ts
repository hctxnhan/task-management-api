import { IsValidColumnNameConstraint } from '@/common/decorators/valid-column-name.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsOptional, Validate } from 'class-validator';

export class LabelPaginationDto extends PaginationDto {
  @IsOptional()
  @Validate(IsValidColumnNameConstraint, ['Label'], {})
  orderBy?: string;

  @IsOptional()
  search?: string;
}
