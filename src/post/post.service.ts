import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>
  ){}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findSchoolPosts(school_id: number): Promise<Posts[]> {

    const post = this.postRepo.find({
      where: {
        school:{
          id: school_id
        }
      }
    })
    
    if(!post) throw new NotFoundException;

    return post;

  }

  async findOnePost(post_id: number): Promise<Posts>{

    const post = this.postRepo.findOne({
      where: {
        id: post_id
      }
    })
    
    return post;
  }

  async findOneSchoolPost(school_id: number, post_id: number): Promise<Posts> {

    const post = this.postRepo.findOne({
      where: {
        school: {
          id: school_id
        },
        id: post_id
      }
    })

    if(!post) throw new NotFoundException;

    return post;

  }

  async update(school_id: number, post_id: number, updatePostDto: UpdatePostDto): Promise<Posts> {

    const post = this.postRepo.findOne({
      where: {
        school: {
          id: school_id
        },
        id: post_id
      }
    })

    if(!post) throw new NotFoundException;

    this.postRepo.update(post_id, updatePostDto);

    return this.postRepo.findOne({
      where: {
        school: {
          id: school_id
        },
        id: post_id
      }
    });

  }

  async remove(school_id: number, post_id: number): Promise<any> {

    const post = this.postRepo.findOne({
      where: {
        school: {
          id: school_id
        },
        id: post_id
      }
    });

    if(!post) throw new NotFoundException;

    this.postRepo.delete(post_id);

  }
}
