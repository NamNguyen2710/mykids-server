import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XRegExp from 'xregexp';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './entities/comment.entity';
import { CommentTaggedUser } from './entities/comment_tagged_user.entity';
import { UserService } from 'src/users/users.service';
import { ListResponse } from 'src/utils/list-response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepo: Repository<Comments>,
    @InjectRepository(CommentTaggedUser)
    private readonly taggedUserRepo: Repository<CommentTaggedUser>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const tagggedUserRegex = XRegExp(
      '\\[(\\p{L}+\\s*\\p{L}*)\\|(\\d+)\\]',
      'g',
    );
    const matchList = XRegExp.match(
      createCommentDto.message,
      tagggedUserRegex,
      'all',
    );
    const taggedUsers = await Promise.all(
      matchList.map(async (match) => {
        const [, name, id] = XRegExp.exec(match, tagggedUserRegex);
        const user = await this.userService.findOne(+id);
        if (!user) throw new NotFoundException();

        return user;
      }),
    );

    const comment = this.commentRepo.create(createCommentDto);
    comment.createdById = userId;
    comment.belongedToId = postId;
    // comment.taggedUsers = taggedUsers;

    await this.commentRepo.save(createCommentDto);

    return this.commentRepo.findOne({
      where: { id: comment.id },
      relations: ['createdBy', 'taggedUsers'],
    });
  }

  async findAllCommentsOfPost(postId: number): Promise<ListResponse<Comments>> {
    const [comments, total] = await this.commentRepo.findAndCount({
      where: { belongedTo: { id: postId } },
      relations: ['createdBy', 'taggedUsers'],
      take: 10,
      skip: 0,
    });

    return {
      data: comments,
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

  async update(commentId: number, updateCommentDto: UpdateCommentDto) {
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

  async remove(commentId: number): Promise<boolean> {
    await this.commentRepo.softDelete(commentId);
    return true;
  }

  async validateCommentOwnership(userId: number, commentId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId, createdById: userId },
    });
    return !!comment;
  }
}
