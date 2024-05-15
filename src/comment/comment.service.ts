import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepo: Repository<Comments>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
  ) {}

  async create(
    request: Request,
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comments> {
    const data = this.extractTokenFromHeader(request).toString();

    if (!data) throw new UnauthorizedException();
    const user = await this.userRepo.findOne({
      where: {
        id: parseInt(data),
      },
    });

    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });

    if (!user || !post) throw new NotFoundException();

    createCommentDto.createdBy = user;
    createCommentDto.belongedTo = post;

    return this.commentRepo.save(createCommentDto);
  }

  async findAllCommentsOfPost(postId: number): Promise<Comments[]> {
    return this.commentRepo.find({
      where: {
        belongedTo: {
          id: postId,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    request: Request,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comments> {
    const data = this.extractTokenFromHeader(request).toString();

    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found!');

    if (comment.createdBy.id != parseInt(data))
      throw new UnauthorizedException();

    this.commentRepo.update(commentId, updateCommentDto);

    return this.commentRepo.findOne({
      where: {
        id: commentId,
      },
    });
  }

  async remove(request: Request, commentId: number): Promise<void> {
    const data = this.extractTokenFromHeader(request).toString();

    const comment = this.commentRepo.findOne({
      where: {
        createdBy: {
          id: parseInt(data),
        },
        id: commentId,
      },
    });

    if (!comment) throw new NotFoundException();

    this.commentRepo.delete(commentId);
  }

  private extractTokenFromHeader(request: Request) {
    const data = request.headers.user;
    return data;
  }
}
