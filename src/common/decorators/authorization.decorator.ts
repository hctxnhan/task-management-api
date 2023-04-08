import { Permission } from '@/features/authorization/permission.type';
import { PermissionScope } from '@/features/authorization/resource-owner.type';
import { ResourceType } from '@/features/authorization/resource-type.type';
import { SetMetadata } from '@nestjs/common';

export const enum AuthorizationAttribute {
  IS_PUBLIC = 'IS_PUBLIC',
  NEED_AUTHORIZED = 'NEED_AUTHORIZED',
  RESOURCE_TYPE = 'RESOURCE_TYPE',
  NO_AUTHORIZATION = 'NO_AUTHORIZATION',
}

export const Public = () => SetMetadata(AuthorizationAttribute.IS_PUBLIC, true);
export const NoAuthorization = () =>
  SetMetadata(AuthorizationAttribute.NO_AUTHORIZATION, true);

export function SetResourceType(resourceType: ResourceType) {
  return SetMetadata(AuthorizationAttribute.RESOURCE_TYPE, resourceType);
}

export function SetAuthorization(
  permission: Permission,
  scope: PermissionScope = PermissionScope.OWN,
) {
  return SetMetadata(AuthorizationAttribute.NEED_AUTHORIZED, {
    permission,
    scope,
  });
}
