// import {
//   ExecutionContext,
//   Injectable,
//   Request,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
// import { AuthGuard } from '@nestjs/passport';
// import { IS_PUBLIC_KEY } from 'src/guard/public.decorator';
// import { JwtPayload } from './jwt-payload.interface';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext) {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) {
//       return true;
//     }
//     return super.canActivate(context) as boolean;
//   }

//   handleRequest(err, user, info, context: ExecutionContext) {
//     if (err || !user) {
//       if (info instanceof TokenExpiredError) {
//         throw new UnauthorizedException('Token has expired');
//       } else if (info instanceof JsonWebTokenError) {
//         throw new UnauthorizedException('Invalid token');
//       } else {
//         throw new UnauthorizedException('Unauthorized');
//       }
//     }

//     console.log(`User ${user.firstName} is authenticated`); // Add custom logging

//     return user;
//   }
// }
