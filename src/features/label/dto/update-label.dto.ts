import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLabelDto } from './create-label.dto';

export class UpdateLabelDto extends OmitType(PartialType(CreateLabelDto), [
  'groupId',
] as const) {}
