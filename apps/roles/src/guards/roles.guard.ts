import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log('REQUIRED ROLES: ', requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('REQUEST: ', request);
    const user = request.user;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
