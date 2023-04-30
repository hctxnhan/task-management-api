import { User } from '@/entities/user.entity';
import { Permission } from '@/features/authorization/permission.type';
import { PermissionScope } from '@/features/authorization/resource-owner.type';
import { Role } from '@/features/authorization/role.type';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AuthorizationAttribute } from '../decorators/authorization.decorator';
import { resourceTypeToEntity } from '@/utils/resource-type-to-entity.util';
import { ResourceType } from '@/features/authorization/resource-type.type';
import { checkPermission } from '@/utils/check-permission.util';
import { Request } from 'express';
import { GroupService } from '@/features/group/group.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
    private readonly groupService: GroupService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.user as User;
    let role = Role.USER;

    const isPublic = this.reflector.get<boolean>(
      AuthorizationAttribute.IS_PUBLIC,
      context.getHandler(),
    );

    const noAuthorization = this.reflector.get<boolean>(
      AuthorizationAttribute.NO_AUTHORIZATION,
      context.getHandler(),
    );

    if (isPublic || noAuthorization) {
      return true;
    }

    const needAuthorized = this.reflector.get<{
      permission: Permission;
      scope: PermissionScope;
      options?: {
        resourceId?: string;
      };
    }>(AuthorizationAttribute.NEED_AUTHORIZED, context.getHandler());

    const resourceType = this.reflector.getAllAndOverride<ResourceType>(
      AuthorizationAttribute.RESOURCE_TYPE,
      [context.getHandler(), context.getClass()],
    );

    if (needAuthorized) {
      const { permission, scope, options } = needAuthorized;
      // If the route is need to be manually authorized, then return true
      if (scope === PermissionScope.MANUAL) {
        return true;
      }

      const resourceId =
        request.params[options?.resourceId ?? 'id'] ||
        request.body[options?.resourceId ?? 'id'];

      let resource;
      if (resourceId) {
        resource = await this.dataSource
          .getRepository(resourceTypeToEntity[resourceType])
          .findOne({
            where: {
              id: resourceId,
            },
          });
        if (!resource) {
          throw new NotFoundException(`${resourceType} not found`);
        }
      }

      const groupId =
        request.params.groupId ??
        request.body.groupId ??
        request.query.groupId ??
        resource?.groupId;

      if (
        (scope === PermissionScope.GROUP || scope === PermissionScope.ALL) &&
        groupId
      ) {
        role = await this.groupService.checkGroupRole(groupId, user.id);
      }
      if (
        scope === PermissionScope.OWN ||
        (scope === PermissionScope.ALL && role === Role.USER && !groupId)
      ) {
        if (resource) {
          const isOwner = resource.ownerId === user.id;
          if (!isOwner) {
            throw new ForbiddenException(
              'You are not the owner of this resource',
            );
          }
        }
      }
      const actualScope =
        scope === PermissionScope.ALL
          ? groupId
            ? PermissionScope.GROUP
            : PermissionScope.OWN
          : scope;

      const hasAccess = checkPermission(
        resourceType,
        role,
        permission,
        actualScope,
      );

      if (!hasAccess) {
        throw new ForbiddenException(
          'You are not authorized to perform this action',
        );
      }

      request['resource'] = resource;
      return true;
    }
  }
}
