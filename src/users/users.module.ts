import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { ValidationService } from './validation.service';

import { Users } from './entity/users.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Students } from 'src/student/entities/student.entity';
import { Classrooms } from 'src/class/entities/class.entity';

@Global()
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Users, Schools, Students, Classrooms]),
  ],
  controllers: [UsersController],
  providers: [UserService, ValidationService],
  exports: [UserService, ValidationService],
})
export class UsersModule {}
