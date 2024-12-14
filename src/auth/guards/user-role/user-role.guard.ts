import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../../../auth/decorators';
import { User } from '../../../auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      ctx.getHandler(),
    );
    if (!validRoles || validRoles.length === 0) return true;

    const { user }: { user: User } = ctx.switchToHttp().getRequest();
    if (!user) new BadRequestException('user not found');
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );
  }
}
