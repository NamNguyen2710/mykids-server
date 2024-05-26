import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: number): Promise<Users> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: number,
    @Body() user: Users,
  ): Promise<any> {
    return this.usersService.update(userId, user);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(userId);
  }
}
