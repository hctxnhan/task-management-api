import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNumber()
  priority: number;

  @IsOptional()
  @IsNumber()
  groupId?: number;
}
