import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { UserService } from './users.service';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PostService } from 'src/post/post.service';
import { PostInfo } from 'src/entities/post_info.entity';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService,
    private readonly postServicce: PostService,
  ) {}

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

  // create new post (require user id)
  @Post(':user_id/create-post')
  async createPost(@Param('user_id') user_id: number, @Body() createPostdto: CreatePostDto): Promise<PostInfo>{
    return this.postServicce.create(user_id, createPostdto);
  }

  // update user (user_id), post (post_id)
  @Put(':user_id/post/:post_id')
  async updatePost(
    @Param('post_id') post_id: number, 
    @Param('user_id') user_id: number, 
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostInfo>{

    return this.postServicce.update(post_id, user_id, updatePostDto);
  
  }

  // find post of users to delete
  @Delete(':user_id/post/:post_id')
  async deletePost(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number
  ): Promise<void>{

    await this.postServicce.remove(post_id,  user_id);
    
  }
}
