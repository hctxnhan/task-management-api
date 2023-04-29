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

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
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
    }>(AuthorizationAttribute.NEED_AUTHORIZED, context.getHandler());

    const resourceType = this.reflector.getAllAndOverride<ResourceType>(
      AuthorizationAttribute.RESOURCE_TYPE,
      [context.getHandler(), context.getClass()],
    );

    if (needAuthorized) {
      const { permission, scope } = needAuthorized;
      // If the route is need to be manually authorized, then return true
      if (scope === PermissionScope.MANUAL) {
        return true;
      }

      const resourceId = request.params.id || request.body.id;
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
          throw new NotFoundException('Resource not found');
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
        const group = await this.dataSource
          .getRepository(resourceTypeToEntity[ResourceType.GROUP])
          .findOne({
            where: {
              id: groupId,
            },
          });

        if (!group) {
          throw new NotFoundException('Group not found');
        }

        const isGroupOwner = group.ownerId === user.id;
        if (isGroupOwner) {
          role = Role.GROUP_OWNER;
        } else {
          const isMemberOfGroup =
            (await this.dataSource
              .getRepository(resourceTypeToEntity[ResourceType.GROUP])
              .createQueryBuilder('group')
              .leftJoinAndSelect('group.members', 'member')
              .where('group.id = :groupId', { groupId })
              .andWhere('member.id = :userId', { userId: user.id })
              .getCount()) > 0;

          if (isMemberOfGroup) {
            role = Role.GROUP_MEMBER;
          }
        }
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
