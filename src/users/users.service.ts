import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PostService } from 'src/post/post.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly postService: PostService
  ) {}

  async findAll(isActive: boolean = true): Promise<Users[]> {
    return this.userRepository.find({ where: { isActive } });
  }

  async findOne(id: number, isActive: boolean = true): Promise<Users> {
    return this.userRepository.findOne({ where: { id, isActive } });
  }

  async findOneByPhone(number: string, isActive: boolean = true) {
    return this.userRepository.findOne({
      where: { phoneNumber: number, isActive },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newuser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newuser);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  async like(user_id: number, post_id: number): Promise<void> {
    const post = await this.postService.findOnePost(post_id);

    const user = await this.userRepository.findOne({ 
      where: { 
        id: user_id 
      },
      relations: {
        likedPosts: true
      }
    });

    if(!user || !post) throw new NotFoundException('Cannot found user or post');

    user.likedPosts.push(post);

    await this.userRepository.save(user);
  }

  async unlike(user_id: number, post_id: number): Promise<void> {

    const user = await this.userRepository.findOne({ 
      where: { 
        id: user_id 
      },
      relations: {
        likedPosts: true
      }
    });

    if(!user) throw new NotFoundException('Cannot found user');

    user.likedPosts = user.likedPosts.filter((likedpost) => {
      return likedpost.id != post_id;
    }) 

    await this.userRepository.save(user);
  }

  // async getLikePost(user_id: number): Promise<any> {
    
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id: user_id
  //     },
  //     relations: {
  //       likedPosts: true
  //     }
  //   })

  //   return user.likedPosts;
  // }
}
