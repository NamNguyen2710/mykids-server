import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppClients } from 'src/auth/entities/client.entity';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([AppClients])],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
