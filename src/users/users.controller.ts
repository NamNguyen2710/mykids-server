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
import { Posts } from 'src/post/entities/post.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Users> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  // User like post
  @Post(':user_id/like/:post_id')
  async likePost(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number
  ){
    this.usersService.like(user_id, post_id);
  }

  // User unlike post
  @Post(':user_id/unlike/:post_id')
  async unlikePost(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number
  ){
    this.usersService.unlike(user_id, post_id);
  }

  // @Get(':user_id/like_posts')
  // async getlike(
  //   @Param('user_id') user_id: number
  // ): Promise<Posts[]>{
  //   return this.usersService.getLikePost(user_id);
  // }


  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: Users): Promise<any> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }
}
