import { Order } from '@/types/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsIn([5, 10, 20, 50])
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([Order.ASC, Order.DESC])
  order?: Order = Order.ASC;

  @ApiPropertyOptional()
  @IsOptional()
  groupId?: number;
}
