import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNumber()
  priority: number;

  groupId?: number;
}
