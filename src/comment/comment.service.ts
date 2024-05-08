import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { Posts } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepo: Repository<Comments>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>
  ){}

  async create(
    user_id: number, 
    post_id: number, 
    createCommentDto: CreateCommentDto
  ): Promise<Comments> {
    const user = await this.userRepo.findOne({
      where: {
        id: user_id
      }
    })

    const post = await this.postRepo.findOne({
      where: {
        id: post_id
      }
    })

    if(!user || !post) throw new NotFoundException;

    createCommentDto.createdBy = user;
    createCommentDto.belongedTo = post;

    return this.commentRepo.save(createCommentDto);

  }

  async findAllCommentsOfPost(post_id: number):Promise<Comments[]> {

    return this.commentRepo.find({
      where: {
        belongedTo: {
          id: post_id
        }
      }
    })

  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(post_id: number, comment_id: number, updateCommentDto: UpdateCommentDto): Promise<Comments> {

    const comment = this.commentRepo.find({
      where: {
        belongedTo: {
          id: post_id
        },
        id: comment_id
      }
    })

    if(!comment) throw new NotFoundException;

    this.commentRepo.update(comment_id, updateCommentDto);

    return this.commentRepo.findOne({
      where: {
        belongedTo: {
          id: post_id
        },
        id: comment_id
      }
    })

  }

  async remove(user_id: number, comment_id: number): Promise<void> {
    const comment = this.commentRepo.findOne({
      where: {
        createdBy: {
          id: user_id
        },
        id: comment_id
      }
    })

    if(!comment) throw new NotFoundException;

    this.commentRepo.delete(comment_id);
  }
}
