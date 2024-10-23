import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { ValidationService } from './validation.service';

import { Users } from './entity/users.entity';
import { Roles } from 'src/role/entities/roles.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [UsersController],
  providers: [UserService, ValidationService],
  exports: [UserService, ValidationService],
})
export class UsersModule {}
