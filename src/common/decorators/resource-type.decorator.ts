import { SetMetadata } from '@nestjs/common/decorators';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export const SetResourceType = (resourceType: EntityTarget<ObjectLiteral>) =>
  SetMetadata('resourceType', resourceType);
