import { IsNumber } from 'class-validator';

export class AssignTaskDto {
  @IsNumber()
  groupId: number;

  @IsNumber()
  userId: number;
}
