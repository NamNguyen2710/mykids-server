import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [clientId, clientSecret] = this.extractTokenFromHeader(request);
    if (!clientId || !clientSecret) throw new UnauthorizedException();

    try {
      const payload = await this.authService.findClient(clientId, clientSecret);
      request['client'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string[] | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Basic' ? atob(token).split(':') : [];
  }
}
