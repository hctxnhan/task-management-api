import { Permission } from '@/features/authorization/permission.type';
import { PermissionScope } from '@/features/authorization/resource-owner.type';
import { Role } from '@/features/authorization/role.type';
import { rbacMap } from '@/features/authorization/rbac-map.type';
import { ResourceType } from '@/features/authorization/resource-type.type';

export function checkPermisison(
  resourceType: ResourceType,
  role: Role,
  permission: Permission,
  scope: PermissionScope,
): boolean {
  return rbacMap[resourceType][role][permission] === scope;
}
