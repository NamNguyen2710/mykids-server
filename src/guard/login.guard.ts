import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    console.log(request);

    if (isPublic) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) throw new UnauthorizedException();
    console.log('hi');
    try {
      console.log('what');
      const payload = this.jwtService.verify(token);
      console.log(payload + 'hi');
      request['user'] = payload.sub;
    } catch {
      console.log('nani');
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
