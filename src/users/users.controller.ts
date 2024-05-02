import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  //get all users
  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Users> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  //update user
  @Put(':id')
  async update (@Param('id') id: number, @Body() user: Users): Promise<any> {
    return this.usersService.update(id, user);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    //handle error if user does not exist
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }
}
