import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/users/users.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.userService.findOne(payload.sub);

      if (!user) throw new UnauthorizedException('User not found');
      request.user = user;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
