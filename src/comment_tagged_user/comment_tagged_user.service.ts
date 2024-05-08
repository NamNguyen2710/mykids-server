import { Injectable } from '@nestjs/common';
import { CreateCommentTaggedUserDto } from './dto/create-comment_tagged_user.dto';
import { UpdateCommentTaggedUserDto } from './dto/update-comment_tagged_user.dto';

@Injectable()
export class CommentTaggedUserService {
  create(createCommentTaggedUserDto: CreateCommentTaggedUserDto) {
    return 'This action adds a new commentTaggedUser';
  }

  findAll() {
    return `This action returns all commentTaggedUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentTaggedUser`;
  }

  update(id: number, updateCommentTaggedUserDto: UpdateCommentTaggedUserDto) {
    return `This action updates a #${id} commentTaggedUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentTaggedUser`;
  }
}
