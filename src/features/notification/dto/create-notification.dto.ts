import { NotificationType } from '@/types/enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsNumber()
  ownerId: number;
}
