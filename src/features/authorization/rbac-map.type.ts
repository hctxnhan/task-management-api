import { Permission } from './permission.type';
import { Role } from './role.type';
import { ResourceType } from './resource-type.type';
import { PermissionScope } from './resource-owner.type';

export type RBACMap = {
  [key in ResourceType]?: {
    [key in Role]?: {
      [key in Permission]?: PermissionScope;
    };
  };
};

const FULL_ACCESS_GROUP_OWNER: Record<Permission, PermissionScope> = {
  [Permission.CREATE]: PermissionScope.GROUP,
  [Permission.READ]: PermissionScope.GROUP,
  [Permission.UPDATE]: PermissionScope.GROUP,
  [Permission.DELETE]: PermissionScope.GROUP,
};

const FULL_ACCESS_OWN_RESOURCE: Record<Permission, PermissionScope> = {
  [Permission.CREATE]: PermissionScope.OWN,
  [Permission.READ]: PermissionScope.OWN,
  [Permission.UPDATE]: PermissionScope.OWN,
  [Permission.DELETE]: PermissionScope.OWN,
};

export const rbacMap: RBACMap = {
  [ResourceType.TASK]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.UPDATE]: PermissionScope.GROUP,
      [Permission.READ]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.LABEL]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.READ]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.CATEGORY]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.READ]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.GROUP]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.READ]: PermissionScope.GROUP,
      [Permission.UPDATE]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.COMMENT]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.READ]: PermissionScope.GROUP,
      [Permission.UPDATE]: PermissionScope.GROUP,
      [Permission.DELETE]: PermissionScope.GROUP,
      [Permission.CREATE]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.GROUP_JOIN_INVITATION]: {
    [Role.GROUP_OWNER]: {
      [Permission.UPDATE]: PermissionScope.GROUP,
      [Permission.READ]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
  [ResourceType.NOTIFICATION]: {
    [Role.GROUP_OWNER]: FULL_ACCESS_GROUP_OWNER,
    [Role.GROUP_MEMBER]: {
      [Permission.READ]: PermissionScope.GROUP,
    },
    [Role.USER]: FULL_ACCESS_OWN_RESOURCE,
  },
};
