import { SetMetadata } from '@nestjs/common';

export const enum AuthorizationType {
  IS_PUBLIC = 'IS_PUBLIC',
}

export const Public = () => SetMetadata(AuthorizationType.IS_PUBLIC, true);
