import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UserService } from './users.service';

import { Users } from './entity/users.entity';
import { Schools } from 'src/school/entities/school.entity';

@Global()
@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Users, Schools])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
