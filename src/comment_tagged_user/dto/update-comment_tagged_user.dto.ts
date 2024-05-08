import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentTaggedUserDto } from './create-comment_tagged_user.dto';

export class UpdateCommentTaggedUserDto extends PartialType(CreateCommentTaggedUserDto) {}
