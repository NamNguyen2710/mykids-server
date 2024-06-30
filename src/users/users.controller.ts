import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';

import { UserService } from './users.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { Users } from './entity/users.entity';
import * as Role from './entity/roles.data';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { QueryUserDto, QueryUserSchema } from './dto/query-user.dto';

@Controller('users')
@UseGuards(LoginGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryUserSchema)) query: QueryUserDto,
  ): Promise<Users[]> {
    const user = await this.usersService.findOne(request.user.sub, [
      'assignedSchool',
    ]);

    if (user.roleId === Role.SuperAdmin.id) {
      return this.usersService.findAll([], query);
    }
    if (user.roleId === Role.SchoolAdmin.id) {
      query.schoolId = user.assignedSchool.id;
      return this.usersService.findAll([], query);
    }

    throw new ForbiddenException('You are not allowed to access this resource');
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number): Promise<Users> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  @Post()
  async createAdmin(
    @Request() request,
    @Body(new ZodValidationPipe(CreateUserSchema))
    createUserDto: CreateUserDto,
  ): Promise<Users> {
    const permission = this.usersService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    return this.usersService.create(createUserDto);
  }

  @Put(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: Users,
  ): Promise<any> {
    // TODO: Update user
    return this.usersService.update(userId, user);
  }

  @Delete(':userId')
  async delete(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(userId);
  }
}
