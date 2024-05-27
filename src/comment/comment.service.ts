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
import { ListResponse } from 'src/utils/list-response.dto';
import { ResponseCommentDto } from 'src/comment/dto/response-comment.dto';

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
    userId: number,
    postId: number,
    createCommentDto: Partial<CreateCommentDto>,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found!');

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found!');

    createCommentDto.createdBy = user;
    createCommentDto.belongedTo = post;

    const result = await this.commentRepo.save(createCommentDto);
    const comment = {
      id: result.id,
      message: result.message,
      createdAt: result.updatedAt,
      updatedAt: result.createdAt,
      createdBy: {
        id: result.createdBy.id,
        firstName: result.createdBy.firstName,
        lastName: result.createdBy.lastName,
        phoneNumber: result.createdBy.phoneNumber,
      },
    };

    return comment;
  }

  async findAllCommentsOfPost(
    postId: number,
  ): Promise<ListResponse<ResponseCommentDto>> {
    const [comments, total] = await this.commentRepo.findAndCount({
      where: { belongedTo: { id: postId } },
      relations: { createdBy: true },
      take: 10,
      skip: 0,
    });

    const result = comments.map((comment) => {
      delete comment.deletedAt;

      return {
        ...comment,
        createdBy: {
          id: comment.createdBy.id,
          firstName: comment.createdBy.firstName,
          lastName: comment.createdBy.lastName,
          phoneNumber: comment.createdBy.phoneNumber,
        },
      };
    });

    return {
      data: result,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / 10),
        page: 1,
        limit: 10,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: { createdBy: true },
    });

    if (!comment) throw new NotFoundException('Comment not found!');
    if (comment.createdBy.id != userId) throw new UnauthorizedException();

    await this.commentRepo.update(commentId, updateCommentDto);
    const result = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: { createdBy: true },
    });

    const updatedComment = {
      id: result.id,
      message: result.message,
      createdAt: result.updatedAt,
      updatedAt: result.createdAt,
      createdBy: {
        id: result.createdBy.id,
        firstName: result.createdBy.firstName,
        lastName: result.createdBy.lastName,
        phoneNumber: result.createdBy.phoneNumber,
      },
    };

    return updatedComment;
  }

  async remove(userId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: { createdBy: true },
    });

    if (!comment) throw new NotFoundException();
    if (comment.createdBy.id != userId) throw new UnauthorizedException();

    this.commentRepo.softDelete(commentId);
  }
}
