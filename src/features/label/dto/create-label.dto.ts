import {
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsHexColor()
  color: string;

  @IsNumber()
  @IsOptional()
  groupId?: number;
}
