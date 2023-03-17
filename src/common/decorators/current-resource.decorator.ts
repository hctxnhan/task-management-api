import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentResource = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resource = request.resource;

    return resource ?? null;
  },
);
