import { IsNumber } from 'class-validator';

export class UnassignTaskDto {
  @IsNumber()
  groupId: number;
}
