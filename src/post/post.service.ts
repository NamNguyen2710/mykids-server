import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { Request } from 'express';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findSchoolPosts(request: Request): Promise<Posts[]> {
    const data = parseInt(this.extractTokenFromHeader(request).toString());

    const user = await this.userRepo.findOne({
      where: {
        id: data,
      },
    });

    if (!user) throw new UnauthorizedException('Please login first');

    const post = this.postRepo.find({
      where: {
        school: {
          parents: {
            id: data,
          },
        },
      },
      relations: {
        school: {
          parents: true,
        },
      },
    });

    if (!post) throw new NotFoundException();

    return post;
  }

  async remove(school_id: number, postId: number): Promise<any> {
    const post = this.postRepo.findOne({
      where: {
        school: {
          id: school_id,
        },
        id: postId,
      },
    });

    if (!post) throw new NotFoundException();

    this.postRepo.delete(postId);
  }

  async getLike(postId: number): Promise<any> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
      relations: {
        likedUsers: true,
      },
    });

    return post.likedUsers;
  }

  async like(request: Request, postId: number): Promise<void> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });

    const data = this.extractTokenFromHeader(request).toString();

    const user = await this.userRepo.findOne({
      where: {
        id: parseInt(data),
      },
      relations: {
        likedPosts: true,
      },
    });

    const like = await this.postRepo.findOne({
      where: {
        id: parseInt(data),
        likedUsers: {
          id: postId,
        },
      },
      relations: {
        likedUsers: true,
      },
    });

    if (!user || !post)
      throw new NotFoundException('Cannot found user or post');

    if (like) {
      post.likedUsers = post.likedUsers.filter((likedUsers) => {
        return likedUsers.id != parseInt(data);
      });
    } else {
      post.likedUsers.push(user);
    }

    await this.postRepo.save(post);
  }

  private extractTokenFromHeader(request: Request) {
    const data = request.headers.user;
    return data;
  }

  async publishedPost(request: Request, postId: number): Promise<Posts> {
    const data = parseInt(this.extractTokenFromHeader(request).toString());

    if (!data) throw new UnauthorizedException('Please login first!');

    const post = await this.postRepo.findOne({
      where: {
        id: postId,
        isPublished: false,
      },
    });

    if (!post) throw new NotFoundException();

    post.isPublished = true;
    let date: Date = new Date();
    post.publishedAt = date;
    return this.postRepo.save(post);
  }
}
