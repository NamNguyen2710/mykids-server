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
import {
  ResponseUserDto,
  ResponseUserSchema,
} from 'src/users/dto/response-user.dto';
import { ListResponse } from 'src/utils/list-response.dto';
import { UpdateUserDto, UpdateUserSchema } from 'src/users/dto/update-user.dto';

@Controller('users')
@UseGuards(LoginGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryUserSchema)) query: QueryUserDto,
  ): Promise<ListResponse<ResponseUserDto>> {
    const user = await this.usersService.findOne(request.user.sub, [
      'assignedSchool',
    ]);

    if (user.roleId === Role.SuperAdmin.id) {
      const { data, pagination } = await this.usersService.findAll(
        ['assignedSchool'],
        query,
      );
      return {
        data: data.map((user) => ResponseUserSchema.parse(user)),
        pagination,
      };
    }
    if (user.roleId === Role.SchoolAdmin.id) {
      query.schoolId = user.assignedSchool.id;
      const users = await this.usersService.findAll([], query);
      return {
        data: users.data.map((user) => ResponseUserSchema.parse(user)),
        pagination: users.pagination,
      };
    }

    throw new ForbiddenException('You are not allowed to access this resource');
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number): Promise<Users> {
    // TODO: Add validation
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return user;
  }

  @Post()
  async createAdmin(
    @Request() request,
    @Body(new ZodValidationPipe(CreateUserSchema))
    createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const permission = this.usersService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    const user = await this.usersService.create(createUserDto);
    return ResponseUserSchema.parse(user);
  }

  @Put(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ZodValidationPipe(UpdateUserSchema)) userDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    // TODO: Add validation
    const user = await this.usersService.update(userId, userDto);
    return ResponseUserSchema.parse(user);
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
