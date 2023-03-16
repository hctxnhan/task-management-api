import { IsHexColor, IsString, MaxLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsHexColor()
  color: string;
}
