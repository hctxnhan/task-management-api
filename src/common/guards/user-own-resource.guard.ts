import { User } from '@/entities/user.entity';
import {
  IUserOwnResource,
  resourceHasUserOwner,
} from '@/types/user-own-resource.interface';
import { isUserOwnResource } from '@/utils/user-own-resource.util';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
@Injectable()
export class UserOwnResourceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method === 'POST') {
      return true;
    }

    const user = request.user as User;
    const resourceId = request.params['id'];
    if (!resourceId) {
      return true;
    }

    const resourceType = this.reflector.get<EntityTarget<ObjectLiteral>>(
      'resourceType',
      context.getClass(),
    );

    if (!resourceType) {
      return true;
    }

    const resourceInstance = await this.dataSource
      .getRepository(resourceType)
      .findOne({ where: { id: resourceId } });

    if (!resourceInstance) {
      throw new NotFoundException('Resource not found');
    }

    if (!resourceHasUserOwner(resourceInstance)) {
      return true;
    }

    const isOwner = isUserOwnResource(
      user,
      resourceInstance as IUserOwnResource,
    );

    if (isOwner) {
      request['resource'] = resourceInstance;
    } else {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }

    return isOwner;
  }
}
